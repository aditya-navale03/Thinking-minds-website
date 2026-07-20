import { useState, useEffect } from "react";

import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ExpenseInvoiceTemplate from "../../components/invoice/ExpensesInvoiceTemplate";

//firestore storage
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";

interface Expense {
    id: string;
    itemName: string;
    shopName: string;
    amount: number;
    paymentType: string;
    expenseDate: string;
    department: string;
}

export default function Expenses() {

    const [invoiceData, setInvoiceData] = useState<any>(null);
const invoiceRef = useRef<HTMLDivElement>(null);

    const [itemName, setItemName] = useState("");
    const [shopName, setShopName] = useState("");
    const [amount, setAmount] = useState("");

    const [paymentType, setPaymentType] = useState("Cash");


    const today = new Date().toISOString().split("T")[0];

    const [expenseDate, setExpenseDate] = useState(today);

    const [expenses, setExpenses] = useState<Expense[]>([]);

    const [totalExpenses, setTotalExpenses] = useState(0);
    const [todayExpenses, setTodayExpenses] = useState(0);
    const [monthExpenses, setMonthExpenses] = useState(0);

    const department =
        localStorage.getItem("admin_department")?.toUpperCase() || "";



    const handleAddExpense = async () => {
        if (
            !itemName ||
            !shopName ||
            !amount
        ) {
            alert("Please fill all fields");
            return;
        }

        try {
            await addDoc(
                collection(db, "expenses"),
                {
                    itemName,
                    shopName,
                    amount: Number(amount),
                    paymentType,
                    expenseDate,
                    department,
                    createdAt: serverTimestamp(),
                }
            );

            alert("Expense added successfully!");

            // Reset form
            setItemName("");
            setShopName("");
            setAmount("");
            setPaymentType("Cash");
            setExpenseDate(today);
            loadExpenses();

        } catch (error) {
            console.error(error);
            alert("Failed to add expense");
        }
    };

    const handleReceipt = (expense: Expense) => {
  setInvoiceData({
    shopName: expense.shopName,
    itemName: expense.itemName,
    amount: expense.amount,
    paymentType: expense.paymentType,
    expenseDate: expense.expenseDate,
  });
};

const generatePDF = async () => {
  if (!invoiceRef.current) return;

  const canvas = await html2canvas(invoiceRef.current, {
    scale: 2,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  pdf.save(`Expense-${invoiceData.itemName}.pdf`);

  setInvoiceData(null);
};
useEffect(() => {
  if (invoiceData) {
    generatePDF();
  }
}, [invoiceData]);

    const loadExpenses = async () => {
        try {
            const q = query(
                collection(db, "expenses"),
                where("department", "==", department),
                orderBy("createdAt", "desc")
            );

            const snapshot = await getDocs(q);

            const expenseList: Expense[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Expense, "id">),
            }));

            setExpenses(expenseList);

            const total = expenseList.reduce(
                (sum, expense) => sum + expense.amount,
                0
            );

            setTotalExpenses(total);

            const todayTotal = expenseList
                .filter((e) => e.expenseDate === today)
                .reduce((sum, e) => sum + e.amount, 0);

            setTodayExpenses(todayTotal);

            const currentMonth = today.slice(0, 7);

            const monthTotal = expenseList
                .filter((e) => e.expenseDate.startsWith(currentMonth))
                .reduce((sum, e) => sum + e.amount, 0);

            setMonthExpenses(monthTotal);

        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteExpense = async (id: string) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this expense?"
        );

        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, "expenses", id));

            loadExpenses();

            alert("Expense deleted successfully.");
        } catch (error) {
            console.error(error);
            alert("Failed to delete expense.");
        }
    };

    useEffect(() => {
        loadExpenses();
    }, []);

    return (
        <div className="p-8">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white">
                    Expense Management
                </h1>

                <p className="text-slate-400 mt-2">
                    Add and manage institute expenses.
                </p>
            </div>

            {/* Form Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl max-w-4xl">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Item Name */}
                    <div>
                        <label className="block text-slate-300 mb-2">
                            Item Name
                        </label>

                        <input
                            type="text"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            placeholder="Printer Paper"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>

                    {/* Shop Name */}
                    <div>
                        <label className="block text-slate-300 mb-2">
                            Shop / Person Name
                        </label>

                        <input
                            type="text"
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            placeholder="ABC Stationery"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-slate-300 mb-2">
                            Amount
                        </label>

                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="500"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 mb-2">
                            Payment Type
                        </label>

                        <select
                            value={paymentType}
                            onChange={(e) => setPaymentType(e.target.value)}
                            className="
      w-full
      bg-slate-800
      border
      border-slate-700
      rounded-xl
      px-4
      py-3
      text-white
      focus:outline-none
      focus:ring-2
      focus:ring-violet-500
    "
                        >
                            <option value="Cash">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Cheque">Cheque</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-300 mb-2">
                            Expense Date
                        </label>

                        <input
                            type="date"
                            value={expenseDate}
                            onFocus={() => {
                                // user clicked the date field, now they can choose another date
                            }}
                            onChange={(e) => setExpenseDate(e.target.value)}
                            className="
            w-full
            bg-slate-800
            border
            border-slate-700
            rounded-xl
            px-4
            py-3
            text-white
            focus:outline-none
            focus:ring-2
            focus:ring-violet-500
        "
                        />
                    </div>

                </div>

                {/* Button */}
                <div className="mt-8">
                    <button onClick={handleAddExpense}
                        className="
                            bg-violet-600
                            hover:bg-violet-700
                            text-white
                            px-8
                            py-3
                            rounded-xl
                            transition
                        "
                    >
                        Add Expense
                    </button>
                </div>

            </div>


            {/* Expense List */}
            <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                    Expense History
                </h2>

                {expenses.length === 0 ? (
                    <p className="text-slate-400">
                        No expenses found.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-700 text-slate-400">
                                    <th className="pb-4">Date</th>
                                    <th className="pb-4">Item</th>
                                    <th className="pb-4">Shop</th>
                                    <th className="pb-4">Amount</th>
                                    <th className="pb-4">Payment</th>
                                    <th className="pb-4">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {expenses.map((expense) => (
                                    <tr
                                        key={expense.id}
                                        className="border-b border-slate-800 hover:bg-slate-800 transition"
                                    >
                                        <td className="py-4 text-slate-300">
                                            {expense.expenseDate}
                                        </td>

                                        <td className="py-4 text-white font-medium">
                                            {expense.itemName}
                                        </td>

                                        <td className="py-4 text-slate-300">
                                            {expense.shopName}
                                        </td>

                                        <td className="py-4 text-green-400 font-semibold">
                                            ₹{expense.amount.toLocaleString()}
                                        </td>

                                        <td className="py-4 text-slate-300">
                                            {expense.paymentType}
                                        </td>
<td className="py-4 flex gap-2">

    <button
        onClick={() => handleReceipt(expense)}
        className="
        bg-blue-600
        hover:bg-blue-700
        px-4
        py-2
        rounded-lg
        text-white
        transition
        "
    >
        Receipt
    </button>

    <button
        onClick={() => handleDeleteExpense(expense.id)}
        className="
        bg-red-600
        hover:bg-red-700
        px-4
        py-2
        rounded-lg
        text-white
        transition
        "
    >
        Delete
    </button>

</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
{invoiceData && (
  <div
    style={{
      position: "fixed",
      left: "-9999px",
      top: 0,
    }}
  >
    <div ref={invoiceRef}>
      <ExpenseInvoiceTemplate data={invoiceData} />
    </div>
  </div>
)}

        </div>
    );
}