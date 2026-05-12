import { type MenuItem } from "../../../../features/ordering/types/MMtypes";

// 3. Combo Selector Component (SRP & ISP)
export const ComboSelector = ({
  menuItems,
  editingItem,
  formData,
  setFormData,
}: any) => {
  const selectedIds = formData.comboItems
    ? formData.comboItems.split(",").map((id: string) => id.trim())
    : [];

  return (
    <div className="col-span-2">
      <label className="block mb-2 text-sm font-semibold">
        Select Combo Items *
      </label>
      <div className="grid grid-cols-2 gap-2 p-3 bg-muted border border-border rounded-lg max-h-40 overflow-y-auto">
        {menuItems
          .filter(
            (item: MenuItem) => !item.isCombo && item.id !== editingItem?.id,
          )
          .map((item: MenuItem) => {
            const isChecked = selectedIds.includes(item.id);
            return (
              <label
                key={item.id}
                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                  isChecked
                    ? "bg-primary/10 border-primary/20"
                    : "hover:bg-background/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => {
                    let newIds = e.target.checked
                      ? [...selectedIds, item.id]
                      : selectedIds.filter((id: string) => id !== item.id);
                    setFormData({ ...formData, comboItems: newIds.join(", ") });
                  }}
                  className="w-4 h-4 rounded border-border text-primary"
                />
                <span className="text-xs truncate font-medium">
                  {item.name}
                </span>
              </label>
            );
          })}
      </div>
    </div>
  );
};
