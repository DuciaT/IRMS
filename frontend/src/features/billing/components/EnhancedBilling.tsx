import { CreditCard, DollarSign, Receipt } from "lucide-react";
import { StatCard } from "./StatCard/StatCard";
import { BillingTable } from "./BillingTable/BillingTable";
import { PaymentModal } from "../../../components/forms/billing/PaymentModal/PaymentModal";
import { RefundModal } from "../../../components/forms/billing/RefundModal";
import { useEnhancedBilling } from "../hooks/useEnhancedBilling";
// import { SplitBillModal } from "../../../components/forms/billing/SplitBillModal";
// import { VoidModal } from "../../../components/forms/billing/VoidModal";

export default function EnhancedBilling() {
  const {
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
  } = useEnhancedBilling();

  // const [showSplitModal, setShowSplitModal] = useState(false);
  // const [showVoidModal, setShowVoidModal] = useState(false);
  // const [splitCount, setSplitCount] = useState(2);
  // const [splitAmounts, setSplitAmounts] = useState<number[]>([]);
  // const [voidReason, setVoidReason] = useState("");

  // const confirmSplitBill = () => {
  //   const totalSplit = splitAmounts.reduce((sum, amt) => sum + amt, 0);
  //   if (Math.abs(totalSplit - calculateTotal()) > 0.01) {
  //     toast.error("Split amounts must equal total bill");
  //     return;
  //   }
  //   toast.success(`Bill split into ${splitCount} parts successfully!`);
  //   setShowSplitModal(false);
  // };

  // const handleVoidBill = () => {
  //   if (!voidReason.trim() || !selectedBill) {
  //     toast.error("Please provide a reason for voiding bill");
  //     return;
  //   }
  //   if (currentUser) {
  //     addAuditLog({
  //       id: `AUDIT-${Date.now()}`,
  //       userId: currentUser.id,
  //       userName: currentUser.name,
  //       action: "void_bill",
  //       targetType: "bill",
  //       targetId: selectedBill.id,
  //       oldValue: selectedBill,
  //       newValue: { paymentStatus: "cancelled", total: 0 },
  //       reason: voidReason,
  //       timestamp: new Date(),
  //     });
  //   }
  //   updateBill(selectedBill.id, { paymentStatus: "cancelled", total: 0 });
  //   setShowVoidModal(false);
  //   setVoidReason("");
  //   toast.success("Bill voided and logged in audit trail");
  // };

  return (
    <div className="space-y-6">
      {/* 1. Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Pending Bills"
          value={bills.filter((b) => b.paymentStatus === "pending").length}
          icon={Receipt}
          hoverColor="hover:shadow-blue-500/20"
          iconBg="bg-accent/10"
          iconColor="text-accent"
        />
        <StatCard
          label="Today's Revenue"
          value={`$${bills
            .filter((b) => b.paymentStatus === "paid")
            .reduce((sum, b) => sum + b.total, 0)
            .toFixed(2)}`}
          icon={DollarSign}
          hoverColor="hover:shadow-red-500/20"
          iconBg="bg-primary/10"
          iconColor="text-primary"
        />
        <StatCard
          label="Transactions Today"
          value={bills.length}
          icon={CreditCard}
          hoverColor="hover:shadow-orange-500/20"
          iconBg="bg-green-500/10"
          iconColor="text-green-500"
        />
      </div>

      {/* 2. Table Section */}
      <BillingTable
        bills={currentBills}
        currentPage={currentPage}
        totalPages={totalPages}
        indexOfFirstItem={indexOfFirstItem}
        onPageChange={setCurrentPage}
        onProcess={openPaymentModal}
        onRefund={openRefundModal}
        onPrint={(bill) => {
          setSelectedBill(bill);
          handlePrintReceipt();
        }}
      />
      {/* 3. Modals Section */}
      {showPaymentModal && selectedBill && (
        <PaymentModal
          selectedBill={selectedBill}
          total={calculateTotal()}
          onClose={() => setShowPaymentModal(false)}
          onProcess={handleProcessPayment}
        />
      )}
      {showRefundModal && selectedBill && (
        <RefundModal
          bill={selectedBill}
          reason={refundReason}
          onReasonChange={setRefundReason}
          onClose={() => setShowRefundModal(false)}
          onConfirm={handleRefund}
        />
      )}
      {/* {showSplitModal && (
        <SplitBillModal
          splitCount={splitCount}
          splitAmounts={splitAmounts}
          totalBill={calculateTotal()}
          onClose={() => setShowSplitModal(false)}
          onSplitCountChange={(count) => {
            setSplitCount(count);
            setSplitAmounts(Array(count).fill(calculateTotal() / count));
          }}
          onAmountChange={(idx, val) => {
            const newAmts = [...splitAmounts];
            newAmts[idx] = val;
            setSplitAmounts(newAmts);
          }}
          onConfirm={confirmSplitBill}
        />
      )} */}

      {/* {showVoidModal && selectedBill && (
        <VoidModal
          bill={selectedBill}
          reason={voidReason}
          onReasonChange={setVoidReason}
          onClose={() => setShowVoidModal(false)}
          onConfirm={handleVoidBill}
        />
      )} */}
    </div>
  );
}
