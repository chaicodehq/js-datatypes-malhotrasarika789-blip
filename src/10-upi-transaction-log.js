/**
 * 💸 UPI Transaction Log Analyzer
 *
 * Aaj kal sab UPI pe chalta hai! Tujhe ek month ke transactions ka log
 * milega, aur tujhe pura analysis karna hai - kitna aaya, kitna gaya,
 * kiski saath zyada transactions hue, etc.
 *
 * Rules:
 *   - transactions is array of objects:
 *     [{ id: "TXN001", type: "credit"/"debit", amount: 500,
 *        to: "Rahul", category: "food", date: "2025-01-15" }, ...]
 *   - Skip transactions where amount is not a positive number
 *   - Skip transactions where type is not "credit" or "debit"
 *   - Calculate (on valid transactions only):
 *     - totalCredit: sum of all "credit" type amounts
 *     - totalDebit: sum of all "debit" type amounts
 *     - netBalance: totalCredit - totalDebit
 *     - transactionCount: total number of valid transactions
 *     - avgTransaction: Math.round(sum of all valid amounts / transactionCount)
 *     - highestTransaction: the full transaction object with highest amount
 *     - categoryBreakdown: object with category as key and total amount as value
 *       e.g., { food: 1500, travel: 800 } (include both credit and debit)
 *     - frequentContact: the "to" field value that appears most often
 *       (if tie, return whichever appears first)
 *     - allAbove100: boolean, true if every valid transaction amount > 100 (use every)
 *     - hasLargeTransaction: boolean, true if some valid amount >= 5000 (use some)
 *   - Hint: Use filter(), reduce(), sort(), find(), every(), some(),
 *     Object.entries(), Math.round(), typeof
 *
 * Validation:
 *   - Agar transactions array nahi hai ya empty hai, return null
 *   - Agar after filtering invalid transactions, koi valid nahi bacha, return null
 *
 * @param {Array<{ id: string, type: string, amount: number, to: string, category: string, date: string }>} transactions
 * @returns {{ totalCredit: number, totalDebit: number, netBalance: number, transactionCount: number, avgTransaction: number, highestTransaction: object, categoryBreakdown: object, frequentContact: string, allAbove100: boolean, hasLargeTransaction: boolean } | null}
 *
 * @example
 *   analyzeUPITransactions([
 *     { id: "T1", type: "credit", amount: 5000, to: "Salary", category: "income", date: "2025-01-01" },
 *     { id: "T2", type: "debit", amount: 200, to: "Swiggy", category: "food", date: "2025-01-02" },
 *     { id: "T3", type: "debit", amount: 100, to: "Swiggy", category: "food", date: "2025-01-03" }
 *   ])
 *   // => { totalCredit: 5000, totalDebit: 300, netBalance: 4700,
 *   //      transactionCount: 3, avgTransaction: 1767,
 *   //      highestTransaction: { id: "T1", ... },
 *   //      categoryBreakdown: { income: 5000, food: 300 },
 *   //      frequentContact: "Swiggy", allAbove100: false, hasLargeTransaction: true }
 */
export function analyzeUPITransactions(transactions) {
  if (!Array.isArray(transactions) || transactions.length === 0) return null;

  // 1️⃣ Filter valid transactions
  const validTxns = transactions.filter(txn => {
    return txn &&
      (txn.type === "credit" || txn.type === "debit") &&
      typeof txn.amount === "number" &&
      txn.amount > 0;
  });

  if (validTxns.length === 0) return null;

  // 2️⃣ Total credit and debit
  const totalCredit = validTxns
    .filter(txn => txn.type === "credit")
    .reduce((sum, txn) => sum + txn.amount, 0);

  const totalDebit = validTxns
    .filter(txn => txn.type === "debit")
    .reduce((sum, txn) => sum + txn.amount, 0);

  // 3️⃣ Net balance
  const netBalance = totalCredit - totalDebit;

  // 4️⃣ Transaction count
  const transactionCount = validTxns.length;

  // 5️⃣ Average transaction
  const totalAmount = validTxns.reduce((sum, txn) => sum + txn.amount, 0);
  const avgTransaction = Math.round(totalAmount / transactionCount);

  // 6️⃣ Highest transaction
  const highestTransaction = validTxns.reduce((maxTxn, txn) => {
    return txn.amount > (maxTxn.amount || 0) ? txn : maxTxn;
  }, {});

  // 7️⃣ Category breakdown
  const categoryBreakdown = validTxns.reduce((obj, txn) => {
    obj[txn.category] = (obj[txn.category] || 0) + txn.amount;
    return obj;
  }, {});

  // 8️⃣ Frequent contact
  const contactCount = validTxns.reduce((obj, txn) => {
    obj[txn.to] = (obj[txn.to] || 0) + 1;
    return obj;
  }, {});
  let frequentContact = "";
  let maxCount = 0;
  for (const [contact, count] of Object.entries(contactCount)) {
    if (count > maxCount) {
      maxCount = count;
      frequentContact = contact;
    }
  }

  // 9️⃣ All above 100?
  const allAbove100 = validTxns.every(txn => txn.amount > 100);

  // 🔟 Has large transaction >= 5000?
  const hasLargeTransaction = validTxns.some(txn => txn.amount >= 5000);

  return {
    totalCredit,
    totalDebit,
    netBalance,
    transactionCount,
    avgTransaction,
    highestTransaction,
    categoryBreakdown,
    frequentContact,
    allAbove100,
    hasLargeTransaction
  };
}
