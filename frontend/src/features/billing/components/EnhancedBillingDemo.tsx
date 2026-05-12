import { motion } from "framer-motion";
import { useState } from "react";
import {
  CreditCard,
  DollarSign,
  Receipt,
  X,
  Printer,
  Send,
  Split,
  RotateCcw,
  Ban,
} from "lucide-react";
import { useStore } from "../../../store/useStore";
import { toast } from "sonner";

export default function EnhancedBilling() {
  const bills = useStore((state) => state.bills);
  const promotions = useStore((state) => state.promotions);
  const updateBill = useStore((state) => state.updateBill);
  const addAuditLog = useStore((state) => state.addAuditLog);
  const currentUser = useStore((state) => state.currentUser);

  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showVoidModal, setShowVoidModal] = useState(false);

  // Split Bill States
  const [splitCount, setSplitCount] = useState(2);
  const [splitAmounts, setSplitAmounts] = useState<number[]>([]);

  // Payment States
  const [tipAmount, setTipAmount] = useState(0);
  const [tipPercentage, setTipPercentage] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [appliedPromotion, setAppliedPromotion] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState(0);

  // Refund/Void States
  const [refundReason, setRefundReason] = useState("");
  const [voidReason, setVoidReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const reversedBills = [...bills].reverse();

  // Tính toán dữ liệu cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBills = reversedBills.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bills.length / itemsPerPage);

  const openPaymentModal = (bill: any) => {
    setSelectedBill(bill);
    const serviceChargeAmount = bill.subtotal * 0.05; // 5% service charge
    setServiceCharge(serviceChargeAmount);
    setTipAmount(0);
    setTipPercentage(0);
    setAppliedPromotion("");
    setDiscountAmount(0);
    setShowPaymentModal(true);
  };

  const calculateTotal = () => {
    if (!selectedBill) return 0;
    const subtotal = selectedBill.subtotal;
    const tax = selectedBill.tax;
    return subtotal + tax + serviceCharge + tipAmount - discountAmount;
  };

  const handlePrintReceipt = () => {
    if (!selectedBill) return;

    const finalTotal = calculateTotal();
    const receiptContent = `
═══════════════════════════════════════
          RESTAURANT RECEIPT
═══════════════════════════════════════
Bill ID: ${selectedBill.id}
Order ID: ${selectedBill.orderId}
Table: ${selectedBill.tableId}
Customer: ${selectedBill.customerName || "N/A"}
Date: ${new Date().toLocaleString()}
───────────────────────────────────────
ITEMS:
${selectedBill.items.map((item: any) => `${item.quantity}x ${item.name} - $${item.total.toFixed(2)}`).join("\n")}
───────────────────────────────────────

TOTAL:            $${finalTotal.toFixed(2)}
═══════════════════════════════════════
        Thank you for dining with us!
═══════════════════════════════════════
    `;

    //     Subtotal:         $${selectedBill.subtotal.toFixed(2)}
    // Tax:              $${selectedBill.tax.toFixed(2)}
    // Service Charge:   $${serviceCharge.toFixed(2)}
    // Tip:              $${tipAmount.toFixed(2)}
    // ${discountAmount > 0 ? `Discount:        -$${discountAmount.toFixed(2)}\n` : ''}───────────────────────────────────────
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(
        '<pre style="font-family: monospace; font-size: 12px; line-height: 1.5;">' +
          receiptContent +
          "</pre>",
      );
      printWindow.document.close();
      printWindow.print();
      toast.success("Receipt sent to printer");
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(receiptContent);
      toast.success("Receipt copied to clipboard");
    }
  };

  const applyPromotion = (promoId: string) => {
    const promo = promotions.find((p) => p.id === promoId && p.active);
    if (!promo) {
      toast.error("Invalid or inactive promotion");
      return;
    }

    // Check min order amount
    if (promo.minOrderAmount && selectedBill.subtotal < promo.minOrderAmount) {
      toast.error(`Minimum order amount is $${promo.minOrderAmount}`);
      return;
    }

    let discount = 0;
    if (promo.type === "percentage") {
      discount = (selectedBill.subtotal * promo.value) / 100;
    } else if (promo.type === "fixed") {
      discount = promo.value;
    }

    setDiscountAmount(discount);
    setAppliedPromotion(promoId);
    toast.success(
      `Promotion "${promo.name}" applied! -$${discount.toFixed(2)}`,
    );
  };

  const handleTipPercentage = (percentage: number) => {
    setTipPercentage(percentage);
    setTipAmount((selectedBill.subtotal * percentage) / 100);
  };

  const handleProcessPayment = (method: "cash" | "card" | "online") => {
    const finalTotal = calculateTotal();

    updateBill(selectedBill.id, {
      tip: tipAmount,
      total: finalTotal,
      paymentMethod: method,
      paymentStatus: "paid",
      paidAt: new Date(),
    });

    // Log if discount was applied
    if (discountAmount > 0 && currentUser) {
      addAuditLog({
        id: `AUDIT-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        action: "discount_override",
        targetType: "bill",
        targetId: selectedBill.id,
        oldValue: { total: selectedBill.total },
        newValue: { total: finalTotal, discount: discountAmount },
        reason: `Applied promotion: ${appliedPromotion}`,
        timestamp: new Date(),
      });
    }

    setShowPaymentModal(false);
    toast.success(
      `Payment of $${finalTotal.toFixed(2)} processed successfully!`,
    );
  };

  const handleSplitBill = () => {
    const total = calculateTotal();
    const equalSplit = total / splitCount;
    const amounts = Array(splitCount).fill(equalSplit);
    setSplitAmounts(amounts);
    setShowSplitModal(true);
  };

  const confirmSplitBill = () => {
    const totalSplit = splitAmounts.reduce((sum, amt) => sum + amt, 0);
    const originalTotal = calculateTotal();

    if (Math.abs(totalSplit - originalTotal) > 0.01) {
      toast.error("Split amounts must equal total bill");
      return;
    }

    toast.success(`Bill split into ${splitCount} parts successfully!`);
    setShowSplitModal(false);
    // In real app, would create separate bills
  };

  const handleRefund = () => {
    if (!refundReason.trim()) {
      toast.error("Please provide a reason for refund");
      return;
    }

    if (currentUser) {
      addAuditLog({
        id: `AUDIT-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        action: "refund",
        targetType: "bill",
        targetId: selectedBill.id,
        oldValue: { paymentStatus: "paid", total: selectedBill.total },
        newValue: { paymentStatus: "refunded", total: 0 },
        reason: refundReason,
        timestamp: new Date(),
      });
    }

    updateBill(selectedBill.id, {
      paymentStatus: "cancelled",
      total: 0,
    });

    setShowRefundModal(false);
    setRefundReason("");
    toast.success("Refund processed and logged in audit trail");
  };

  const handleVoidBill = () => {
    if (!voidReason.trim()) {
      toast.error("Please provide a reason for voiding bill");
      return;
    }

    if (currentUser) {
      addAuditLog({
        id: `AUDIT-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        action: "void_bill",
        targetType: "bill",
        targetId: selectedBill.id,
        oldValue: selectedBill,
        newValue: { paymentStatus: "cancelled", total: 0 },
        reason: voidReason,
        timestamp: new Date(),
      });
    }

    updateBill(selectedBill.id, {
      paymentStatus: "cancelled",
      total: 0,
    });

    setShowVoidModal(false);
    setVoidReason("");
    toast.success("Bill voided and logged in audit trail");
  };

  const pendingBills = bills.filter((b) => b.paymentStatus === "pending");

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="bg-card rounded-xl p-6 border border-border hover:border-transparent shadow-sm hover:shadow-xl hover:shadow-blue-500/20 cursor-default"
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-muted-foreground"
                style={{ fontSize: "0.875rem" }}
              >
                Pending Bills
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2rem",
                  fontWeight: 700,
                }}
                className="mt-1"
              >
                {pendingBills.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Receipt className="w-6 h-6 text-accent" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="bg-card rounded-xl p-6 border border-border hover:border-transparent shadow-sm hover:shadow-xl hover:shadow-red-500/20 cursor-default"
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-muted-foreground"
                style={{ fontSize: "0.875rem" }}
              >
                Today's Revenue
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2rem",
                  fontWeight: 700,
                }}
                className="mt-1 text-primary"
              >
                $
                {bills
                  .filter((b) => b.paymentStatus === "paid")
                  .reduce((sum, b) => sum + b.total, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="bg-card rounded-xl p-6 border border-border hover:border-transparent shadow-sm hover:shadow-xl hover:shadow-orange-500/20 cursor-default"
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-muted-foreground"
                style={{ fontSize: "0.875rem" }}
              >
                Transactions Today
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2rem",
                  fontWeight: 700,
                }}
                className="mt-1"
              >
                {bills.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bills Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-xl border border-border shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-primary/20 bg-primary/80 text-primary-foreground">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 600,
            }}
          >
            Active Bills
          </h2>
          <p
            className="text-primary-foreground/80 mt-1"
            style={{ fontSize: "0.875rem" }}
          >
            Process payments, refunds, and manage billing
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th
                  className="text-left p-4"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Bill ID
                </th>
                <th
                  className="text-left p-4"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Customer
                </th>
                <th
                  className="text-left p-4"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Table
                </th>
                <th
                  className="text-left p-4"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Items
                </th>
                <th
                  className="text-left p-4"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Total
                </th>
                <th
                  className="text-left p-4"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Status
                </th>
                <th
                  className="text-left p-4"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentBills.map((bill, index) => (
                <motion.tr
                  key={bill.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border hover:bg-muted/20 transition-colors"
                >
                  <td
                    className="p-4"
                    style={{ fontSize: "0.875rem", fontWeight: 600 }}
                  >
                    {bill.id}
                  </td>
                  <td className="p-4" style={{ fontSize: "0.875rem" }}>
                    {bill.customerName || "Guest"}
                  </td>
                  <td className="p-4">
                    <span
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full"
                      style={{ fontSize: "0.75rem", fontWeight: 600 }}
                    >
                      {bill.tableId}
                    </span>
                  </td>
                  <td
                    className="p-4 text-muted-foreground"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {bill.items.length} items
                  </td>
                  <td
                    className="p-4"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.125rem",
                      fontWeight: 700,
                    }}
                  >
                    ${bill.total.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        bill.paymentStatus === "paid"
                          ? "bg-green-500/10 text-green-500"
                          : bill.paymentStatus === "cancelled"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-accent/10 text-accent"
                      }`}
                      style={{ fontSize: "0.75rem", fontWeight: 600 }}
                    >
                      {bill.paymentStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {bill.paymentStatus === "pending" ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openPaymentModal(bill)}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                          style={{ fontSize: "0.875rem", fontWeight: 600 }}
                        >
                          Process
                        </motion.button>
                      ) : bill.paymentStatus === "paid" ? (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedBill(bill);
                              setShowRefundModal(true);
                            }}
                            className="p-2 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 rounded-lg transition-colors"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedBill(bill);
                              setTipAmount(bill.tip || 0);
                              setServiceCharge(
                                (bill as any).serviceCharge || 0,
                              );
                              setDiscountAmount((bill as any).discount || 0);
                              handlePrintReceipt();
                            }}
                            className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                          >
                            <Printer className="w-4 h-4" />
                          </motion.button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-4 border-t border-border bg-card/50">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {indexOfFirstItem + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {Math.min(indexOfLastItem, bills.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {bills.length}
              </span>{" "}
              results
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 text-sm font-medium rounded-lg transition-all ${
                      currentPage === i + 1
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Payment Modal */}
      {showPaymentModal && selectedBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full border border-border overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-gradient-to-r from-primary to-primary/80 p-6">
              <div className="flex items-center justify-between">
                <h2
                  className="text-primary-foreground"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                  }}
                >
                  Process Payment
                </h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Bill Summary */}
              <div className="bg-muted/30 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                    Table: {selectedBill.tableId}
                  </span>
                  <span
                    className="text-muted-foreground"
                    style={{ fontSize: "0.875rem" }}
                  >
                    ID: {selectedBill.id}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {selectedBill.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span style={{ fontSize: "0.875rem" }}>
                        {item.quantity}x {item.name}
                      </span>
                      <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                        ${item.total.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-3 space-y-2">
                  {/* <div className="flex justify-between text-muted-foreground">
                    <span style={{ fontSize: "0.875rem" }}>Subtotal</span>
                    <span style={{ fontSize: "0.875rem" }}>
                      ${selectedBill.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span style={{ fontSize: "0.875rem" }}>Tax (10%)</span>
                    <span style={{ fontSize: "0.875rem" }}>
                      ${selectedBill.tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span style={{ fontSize: "0.875rem" }}>
                      Service Charge (5%)
                    </span>
                    <span style={{ fontSize: "0.875rem" }}>
                      ${serviceCharge.toFixed(2)}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span style={{ fontSize: "0.875rem" }}>Discount</span>
                      <span style={{ fontSize: "0.875rem" }}>
                        -${discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span style={{ fontSize: "0.875rem" }}>Tip</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                      ${tipAmount.toFixed(2)}
                    </span>
                  </div> */}
                  <div className="flex justify-between  pt-2">
                    {/* border-t border-border */}
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.125rem",
                        fontWeight: 700,
                      }}
                    >
                      Total
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.125rem",
                        fontWeight: 700,
                      }}
                      className="text-primary"
                    >
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Promotion */}
              {/* <div>
                <p
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                  className="mb-3"
                >
                  Apply Promotion
                </p>
                <select
                  value={appliedPromotion}
                  onChange={(e) => applyPromotion(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
                >
                  <option value="">No promotion</option>
                  {promotions
                    .filter((p) => p.active)
                    .map((promo) => (
                      <option key={promo.id} value={promo.id}>
                        {promo.name} -{" "}
                        {promo.type === "percentage"
                          ? `${promo.value}%`
                          : `$${promo.value}`}{" "}
                        off
                        {promo.code && ` (Code: ${promo.code})`}
                      </option>
                    ))}
                </select>
              </div> */}

              {/* Tip Selection */}
              {/* <div>
                <p
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                  className="mb-3"
                >
                  Add Tip
                </p>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[10, 15, 18, 20].map((percentage) => (
                    <motion.button
                      key={percentage}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTipPercentage(percentage)}
                      className={`py-3 rounded-lg border-2 transition-all ${
                        tipPercentage === percentage
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted hover:border-primary/50"
                      }`}
                      style={{ fontSize: "0.875rem", fontWeight: 600 }}
                    >
                      {percentage}%
                    </motion.button>
                  ))}
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={tipAmount}
                  onChange={(e) => {
                    setTipAmount(parseFloat(e.target.value) || 0);
                    setTipPercentage(0);
                  }}
                  placeholder="Custom tip amount"
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
                />
              </div> */}

              {/* Action Buttons */}
              {/* <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSplitBill}
                  className="flex-1 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  <Split className="w-4 h-4" />
                  Split Bill
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedBill(selectedBill);
                    setShowVoidModal(true);
                    setShowPaymentModal(false);
                  }}
                  className="flex-1 py-3 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  <Ban className="w-4 h-4" />
                  Void Bill
                </motion.button>
              </div> */}

              {/* Payment Methods */}
              <div>
                <p
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                  className="mb-3"
                >
                  Select Payment Method
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleProcessPayment("cash")}
                    className="p-6 bg-muted hover:bg-muted/80 rounded-xl border-2 border-border hover:border-primary transition-all"
                  >
                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                      Cash
                    </p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleProcessPayment("card")}
                    className="p-6 bg-muted hover:bg-muted/80 rounded-xl border-2 border-border hover:border-primary transition-all"
                  >
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                      Card
                    </p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleProcessPayment("online")}
                    className="p-6 bg-muted hover:bg-muted/80 rounded-xl border-2 border-border hover:border-primary transition-all"
                  >
                    <Send className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                      Digital
                    </p>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Split Bill Modal */}
      {showSplitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl shadow-2xl max-w-md w-full border border-border"
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between">
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                    }}
                  >
                    Split Bill
                  </h2>
                  <p
                    className="text-muted-foreground mt-1"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Divide bill into multiple payments
                  </p>
                </div>
                <button
                  onClick={() => setShowSplitModal(false)}
                  className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label
                  className="block mb-2"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Number of splits
                </label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={splitCount}
                  onChange={(e) => {
                    const count = parseInt(e.target.value) || 2;
                    setSplitCount(count);
                    const equalSplit = calculateTotal() / count;
                    setSplitAmounts(Array(count).fill(equalSplit));
                  }}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                {splitAmounts.map((amount, index) => (
                  <div key={index}>
                    <label
                      className="block mb-1"
                      style={{ fontSize: "0.75rem", fontWeight: 600 }}
                    >
                      Split {index + 1}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={amount}
                      onChange={(e) => {
                        const newAmounts = [...splitAmounts];
                        newAmounts[index] = parseFloat(e.target.value) || 0;
                        setSplitAmounts(newAmounts);
                      }}
                      className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span style={{ fontSize: "0.875rem" }}>Total Bill</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontSize: "0.875rem" }}>Total Split</span>
                  <span
                    style={{ fontSize: "0.875rem", fontWeight: 600 }}
                    className="text-primary"
                  >
                    $
                    {splitAmounts.reduce((sum, amt) => sum + amt, 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSplitModal(false)}
                  className="flex-1 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmSplitBill}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-all"
                  style={{ fontWeight: 600 }}
                >
                  Confirm Split
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && selectedBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl shadow-2xl max-w-md w-full border border-border"
          >
            <div className="p-6 border-b border-border bg-orange-500/10">
              <div className="flex items-start justify-between">
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                    }}
                  >
                    Process Refund
                  </h2>
                  <p
                    className="text-muted-foreground mt-1"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Bill {selectedBill.id} - ${selectedBill.total.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowRefundModal(false);
                    setRefundReason("");
                  }}
                  className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label
                  className="block mb-2"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Reason for Refund *
                </label>
                <textarea
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  rows={4}
                  placeholder="Explain why this refund is being processed..."
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none resize-none"
                />
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p style={{ fontSize: "0.875rem" }} className="text-orange-800">
                  ⚠️ This action will be logged in the audit trail and requires
                  manager approval.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowRefundModal(false);
                    setRefundReason("");
                  }}
                  className="flex-1 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRefund}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-lg hover:shadow-lg transition-all"
                  style={{ fontWeight: 600 }}
                >
                  <RotateCcw className="w-4 h-4 inline mr-2" />
                  Process Refund
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Void Bill Modal */}
      {showVoidModal && selectedBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl shadow-2xl max-w-md w-full border border-border"
          >
            <div className="p-6 border-b border-border bg-red-500/10">
              <div className="flex items-start justify-between">
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                    }}
                  >
                    Void Bill
                  </h2>
                  <p
                    className="text-muted-foreground mt-1"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Bill {selectedBill.id}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowVoidModal(false);
                    setVoidReason("");
                  }}
                  className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label
                  className="block mb-2"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Reason for Voiding *
                </label>
                <textarea
                  required
                  value={voidReason}
                  onChange={(e) => setVoidReason(e.target.value)}
                  rows={4}
                  placeholder="Explain why this bill is being voided..."
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none resize-none"
                />
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p style={{ fontSize: "0.875rem" }} className="text-red-800">
                  🚨 This action is irreversible and will be logged in the audit
                  trail.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowVoidModal(false);
                    setVoidReason("");
                  }}
                  className="flex-1 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleVoidBill}
                  className="flex-1 py-3 bg-destructive text-destructive-foreground rounded-lg hover:shadow-lg transition-all"
                  style={{ fontWeight: 600 }}
                >
                  <Ban className="w-4 h-4 inline mr-2" />
                  Void Bill
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
