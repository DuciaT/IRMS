import { MenuHeader } from "./MenuHeader/MenuHeader";
import { ItemCard } from "./ItemCard/ItemCard";
import { Pagination } from "./Pagination/Pagination";
import { CartSidebar } from "./CartSideBar/CartSidebar";
import { CustomizationModal } from "../../../components/forms/ordering/CustomizationModal/CustomizationModal";
import { ComboModal } from "../../../components/forms/ordering/ComboModal/ComboModal";
import { useDigitalOrdering } from "../hooks/useDigitalOrdering";

export default function DigitalOrdering() {
  const { states, actions } = useDigitalOrdering();

  return (
    <div className="size-full bg-background flex">
      {/* Left Section: Menu & Navigation */}
      <div className="w-[73%] flex flex-col">
        <MenuHeader
          searchQuery={states.searchQuery}
          setSearchQuery={actions.handleSearchChange}
          categories={states.categories}
          selectedCategory={states.selectedCategory}
          setSelectedCategory={actions.handleCategoryChange}
          setCurrentPage={actions.setCurrentPage}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {states.paginatedMenu.map((item, index) => (
              <ItemCard
                key={item.id}
                item={item}
                index={index}
                promotions={states.promotions}
                openComboModal={actions.openComboModal}
                openCustomizationModal={actions.openCustomizationModal}
                addToCart={actions.addToCart}
              />
            ))}
          </div>

          {states.totalPages > 1 && (
            <Pagination
              currentPage={states.currentPage}
              totalPages={states.totalPages}
              setCurrentPage={actions.setCurrentPage}
            />
          )}
        </main>
      </div>

      {/* Right Section: Cart & Customer Info */}
      <CartSidebar
        cart={states.cart}
        customerName={states.customerName}
        setCustomerName={actions.setCustomerName}
        customerPhone={states.customerPhone}
        setCustomerPhone={actions.setCustomerPhone}
        partySize={states.partySize}
        setPartySize={actions.setPartySize}
        selectedTable={states.selectedTable}
        setSelectedTable={actions.setSelectedTable}
        availableTables={states.availableTables}
        removeFromCart={actions.removeFromCart}
        updateQuantity={actions.updateQuantity}
        updateNotes={actions.updateNotes}
        cartTotal={states.cartTotal}
        submitOrder={actions.submitOrder}
        menuItems={states.menuItems}
      />

      {/* Modals Layer */}
      {states.showCustomModal && states.selectedMenuItem && (
        <CustomizationModal
          selectedMenuItem={states.selectedMenuItem}
          customizations={states.customizations}
          setCustomizations={actions.setCustomizations}
          setShowCustomModal={actions.setShowCustomModal}
          addToCartWithCustomization={actions.addToCartWithCustomization}
        />
      )}

      {states.showComboModal && states.selectedComboItem && (
        <ComboModal
          selectedComboItem={states.selectedComboItem}
          menuItems={states.menuItems}
          comboSelections={states.comboSelections}
          toggleComboSelection={actions.toggleComboSelection}
          setShowComboModal={actions.setShowComboModal}
          addToCartWithCombo={actions.addToCartWithCombo}
        />
      )}
    </div>
  );
}
