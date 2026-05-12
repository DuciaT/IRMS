//Thu thập thông tin khách hàng (Tên, SĐT, Số lượng khách).
export const CartCustomerForm = ({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  partySize,
  setPartySize,
}: any) => (
  <div className="space-y-3 mb-4">
    <div>
      <label
        className="block mb-2"
        style={{ fontSize: "0.875rem", fontWeight: 600 }}
      >
        Customer Name *
      </label>
      <input
        type="text"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        placeholder="Enter customer name"
        className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
      />
    </div>
    <div>
      <label
        className="block mb-2"
        style={{ fontSize: "0.875rem", fontWeight: 600 }}
      >
        Phone Number *
      </label>
      <input
        type="tel"
        value={customerPhone}
        onChange={(e) => setCustomerPhone(e.target.value)}
        placeholder="+1 (555) 123-4567"
        className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
      />
    </div>
    <div>
      <label
        className="block mb-2"
        style={{ fontSize: "0.875rem", fontWeight: 600 }}
      >
        Party Size
      </label>
      <input
        type="number"
        min="1"
        max="20"
        value={partySize}
        onChange={(e) => setPartySize(parseInt(e.target.value) || 1)}
        className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
      />
    </div>
  </div>
);
