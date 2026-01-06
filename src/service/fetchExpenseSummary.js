// src/service/fetchExpenseSummary.js
import { fetchExpenses } from './expenseService'

// Group & summarize expenses
export const getExpenseSummary = async (filterMonth) => {
  const all = await fetchExpenses() // all expenses sorted desc

  const filtered = filterMonth
    ? all.filter(exp => {
        const date = exp.createdAt?.toDate()
        const monthKey = date
          .toLocaleString('default', { month: 'long', year: 'numeric' })
        return monthKey === filterMonth
      })
    : all

  // Sum total & breakdowns
  const summary = {
    total: 0,
    byCategory: {},
    bySource: {},
    byContext: {},
    months: new Set()
  }

  all.forEach(exp => {
    const date = exp.createdAt?.toDate()
    const monthKey = date.toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    })
    summary.months.add(monthKey)
  })

  filtered.forEach(exp => {
    const amt = Number(exp.amount || 0)
    summary.total += amt

    summary.byCategory[exp.category] =
      (summary.byCategory[exp.category] || 0) + amt

    summary.bySource[exp.source] =
      (summary.bySource[exp.source] || 0) + amt

    summary.byContext[exp.context] =
      (summary.byContext[exp.context] || 0) + amt
  })

  return {
    total: summary.total,
    byCategory: summary.byCategory,
    bySource: summary.bySource,
    byContext: summary.byContext,
    months: Array.from(summary.months)
  }
}
