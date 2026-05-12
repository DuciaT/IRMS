import { useState, useMemo } from "react";
import { useStore } from "../../../store/useStore";
import { toast } from "sonner";
import { type Bill } from "../types/types";

export const useEnhancedBilling = () => {
  const bills = useStore((state) => state.bills);
  const updateBill = useStore((state) => state.updateBill);
  const addAuditLog = useStore((state) => state.addAuditLog);
  const currentUser = useStore((state) => state.currentUser);

  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [refundReason, setRefundReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // Memoize calculations for performance
  const { currentBills, totalPages, indexOfFirstItem } = useMemo(() => {
    const reversed = [...bills].reverse();
    const lastIdx = currentPage * itemsPerPage;
    const firstIdx = lastIdx - itemsPerPage;
    return {
      currentBills: reversed.slice(firstIdx, lastIdx),
      totalPages: Math.ceil(bills.length / itemsPerPage),
      indexOfFirstItem: firstIdx,
    };
  }, [bills, currentPage]);

  const calculateTotal = () => {
    if (!selectedBill) return 0;
    return (
      selectedBill.subtotal +
      selectedBill.tax +
      serviceCharge +
      tipAmount -
      discountAmount
    );
  };

  const openPaymentModal = (bill: Bill) => {
    setSelectedBill(bill);
    setServiceCharge(bill.subtotal * 0.05);
    setTipAmount(0);
    setDiscountAmount(0);
    setShowPaymentModal(true);
  };

  const openRefundModal = (bill: Bill) => {
    setSelectedBill(bill);
    setShowRefundModal(true);
  };

  const handlePrintReceipt = (bill?: Bill) => {
    const targetBill = bill || selectedBill;
    if (!targetBill) return;

    // Lưu ý: Nếu print từ table, ta cần dùng total hiện tại của bill đó
    // Nếu print từ modal thanh toán, dùng calculateTotal()
    const finalTotal = bill ? bill.total : calculateTotal();

    const receiptContent = `\n═══════════════════════════════════════\n          RESTAURANT RECEIPT\n═══════════════════════════════════════\nBill ID: ${targetBill.id}\nOrder ID: ${targetBill.orderId}\nTable: ${targetBill.tableId}\nCustomer: ${targetBill.customerName || "N/A"}\nDate: ${new Date().toLocaleString()}\n───────────────────────────────────────\nITEMS:\n${targetBill.items.map((item) => `${item.quantity}x ${item.name} - $${item.total.toFixed(2)}`).join("\n")}\n───────────────────────────────────────\n\nTOTAL:            $${finalTotal.toFixed(2)}\n═══════════════════════════════════════\n        Thank you for dining with us!\n═══════════════════════════════════════\n    `;

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
      navigator.clipboard.writeText(receiptContent);
      toast.success("Receipt copied to clipboard");
    }
  };

  const handleProcessPayment = (method: "cash" | "card" | "online") => {
    if (!selectedBill) return;
    const finalTotal = calculateTotal();
    updateBill(selectedBill.id, {
      tip: tipAmount,
      total: finalTotal,
      paymentMethod: method,
      paymentStatus: "paid",
      paidAt: new Date(),
    });
    setShowPaymentModal(false);
    toast.success(
      `Payment of $${finalTotal.toFixed(2)} processed successfully!`,
    );
  };

  const handleRefund = () => {
    if (!refundReason.trim() || !selectedBill) {
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
    updateBill(selectedBill.id, { paymentStatus: "cancelled", total: 0 });
    setShowRefundModal(false);
    setRefundReason("");
    toast.success("Refund processed and logged in audit trail");
  };

  return {
    bills,
    currentBills,
    currentPage,
    totalPages,
    indexOfFirstItem,
    selectedBill,
    showPaymentModal,
    showRefundModal,
    refundReason,
    setCurrentPage,
    setRefundReason,
    setShowPaymentModal,
    setShowRefundModal,
    openPaymentModal,
    openRefundModal,
    handlePrintReceipt,
    handleProcessPayment,
    handleRefund,
    calculateTotal,
    setSelectedBill,
  };
};
