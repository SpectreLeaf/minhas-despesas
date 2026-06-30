import { openDatabaseSync, type SQLiteDatabase } from "expo-sqlite";

export interface ExpenseRecord {
  id: number;
  description: string;
  date: string;
  price: number;
  paid: boolean;
  isRepeating: boolean;
  isInInstallments: boolean;
  installmentCount?: number;
  currentInstallment?: number;
}

export interface ExpenseOccurrence extends ExpenseRecord {
  occurrenceNumber?: number;
}

export interface ExpenseInput {
  description: string;
  date: string;
  price: number;
  paid: boolean;
  isRepeating: boolean;
  isInInstallments: boolean;
  installmentCount?: number | null;
  currentInstallment?: number | null;
}

type StoredExpense = {
  id: number;
  description: string;
  date: string;
  price: number;
  paid: number;
  isRepeating: number;
  isInInstallments: number;
  installmentCount: number | null;
  currentInstallment: number | null;
};

let database: SQLiteDatabase | null = null;

function getDatabase() {
  if (!database) {
    database = openDatabaseSync("minhas-despesas.db");

    database.execSync(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        price REAL NOT NULL,
        paid INTEGER NOT NULL DEFAULT 0,
        isRepeating INTEGER NOT NULL DEFAULT 0,
        isInInstallments INTEGER NOT NULL DEFAULT 0,
        installmentCount INTEGER,
        currentInstallment INTEGER
      );
    `);

    seedDatabaseIfNeeded();
  }

  return database;
}

function seedDatabaseIfNeeded() {
  const db = getDatabase();
  const result = db.getFirstSync<{ count: number }>(
    "SELECT COUNT(*) as count FROM expenses",
  );

  if (result?.count === 0) {
    const seedExpenses: ExpenseInput[] = [
      {
        description: "Aluguel",
        date: "2026-06-01",
        price: 900,
        paid: true,
        isRepeating: true,
        isInInstallments: false,
      },
      {
        description: "Internet",
        date: "2026-06-15",
        price: 120,
        paid: false,
        isRepeating: true,
        isInInstallments: true,
        installmentCount: 6,
        currentInstallment: 3,
      },
    ];

    seedExpenses.forEach((expense) => createExpense(expense));
  }
}

function toExpenseRecord(row: StoredExpense): ExpenseRecord {
  return {
    id: row.id,
    description: row.description,
    date: row.date,
    price: row.price,
    paid: Boolean(row.paid),
    isRepeating: Boolean(row.isRepeating),
    isInInstallments: Boolean(row.isInInstallments),
    installmentCount: row.installmentCount ?? undefined,
    currentInstallment: row.currentInstallment ?? undefined,
  };
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function parseDate(dateInput: string) {
  return new Date(`${dateInput}T00:00:00`);
}

export function createExpense(input: ExpenseInput): ExpenseRecord {
  const db = getDatabase();
  const result = db.runSync(
    `
      INSERT INTO expenses (
        description,
        date,
        price,
        paid,
        isRepeating,
        isInInstallments,
        installmentCount,
        currentInstallment
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    input.description,
    input.date,
    input.price,
    input.paid ? 1 : 0,
    input.isRepeating ? 1 : 0,
    input.isInInstallments ? 1 : 0,
    input.installmentCount ?? null,
    input.currentInstallment ?? null,
  );

  return {
    ...input,
    id: Number(result.lastInsertRowId),
    paid: input.paid,
    isRepeating: input.isRepeating,
    isInInstallments: input.isInInstallments,
    installmentCount: input.installmentCount ?? undefined,
    currentInstallment: input.currentInstallment ?? undefined,
  };
}

export function getExpenseById(id: number): ExpenseRecord | null {
  const db = getDatabase();
  const row = db.getFirstSync<StoredExpense>(
    "SELECT * FROM expenses WHERE id = ?",
    id,
  );

  return row ? toExpenseRecord(row) : null;
}

export function updateExpense(
  id: number,
  changes: Partial<ExpenseInput> & { paid?: boolean },
): ExpenseRecord | null {
  const db = getDatabase();
  const existing = getExpenseById(id);

  if (!existing) {
    return null;
  }

  const nextPayload = {
    description: changes.description ?? existing.description,
    date: changes.date ?? existing.date,
    price: changes.price ?? existing.price,
    paid: changes.paid ?? existing.paid,
    isRepeating: changes.isRepeating ?? existing.isRepeating,
    isInInstallments: changes.isInInstallments ?? existing.isInInstallments,
    installmentCount: changes.installmentCount ?? existing.installmentCount,
    currentInstallment:
      changes.currentInstallment ?? existing.currentInstallment,
  };

  db.runSync(
    `
      UPDATE expenses
      SET description = ?,
          date = ?,
          price = ?,
          paid = ?,
          isRepeating = ?,
          isInInstallments = ?,
          installmentCount = ?,
          currentInstallment = ?
      WHERE id = ?
    `,
    nextPayload.description,
    nextPayload.date,
    nextPayload.price,
    nextPayload.paid ? 1 : 0,
    nextPayload.isRepeating ? 1 : 0,
    nextPayload.isInInstallments ? 1 : 0,
    nextPayload.installmentCount ?? null,
    nextPayload.currentInstallment ?? null,
    id,
  );

  return { ...existing, ...nextPayload };
}

export function deleteExpense(id: number) {
  const db = getDatabase();
  db.runSync("DELETE FROM expenses WHERE id = ?", id);
}

export function getExpensesForMonth(targetDate: Date): ExpenseOccurrence[] {
  const db = getDatabase();
  const rows = db.getAllSync<StoredExpense>(
    "SELECT * FROM expenses ORDER BY date ASC",
  );
  const targetMonth = monthKey(targetDate);

  return rows
    .flatMap((row) => {
      const expense = toExpenseRecord(row);
      const expenseDate = parseDate(expense.date);
      const expenseMonth = monthKey(expenseDate);

      if (!expense.isRepeating) {
        return expenseMonth === targetMonth
          ? [{ ...expense, occurrenceNumber: 1 }]
          : [];
      }

      const targetYear = targetDate.getFullYear();
      const targetMonthIndex = targetDate.getMonth();
      const expenseYear = expenseDate.getFullYear();
      const expenseMonthIndex = expenseDate.getMonth();
      const monthDiff =
        targetYear * 12 +
        targetMonthIndex -
        (expenseYear * 12 + expenseMonthIndex);

      if (expense.isInInstallments) {
        const installments = expense.installmentCount ?? 1;
        return monthDiff >= 0 && monthDiff < installments
          ? [{ ...expense, occurrenceNumber: monthDiff + 1 }]
          : [];
      }

      return monthDiff >= 0
        ? [{ ...expense, occurrenceNumber: monthDiff + 1 }]
        : [];
    })
    .sort((left, right) => left.date.localeCompare(right.date));
}
