# KyrozPlus: Dish Creation Workflow & Master Integrations

When a restaurant owner adds a new dish in KyrozPlus, it is not just a simple menu entry. The system integrates the dish deeply across three powerful backend engines: **Inventory**, **Costing Master**, and **Wastage Master**. 

This document explains exactly how these systems work together when a new dish is added and sold.

---

## 1. Overview of the Masters

- **Inventory Master**: Tracks raw materials, semi-finished goods, premixes, and packaging. It knows exactly how much stock is left and alerts you when stock is low.
- **Costing Master**: Calculates the exact production cost of a dish by summing up the cost of its ingredients (down to the gram or unit). It ensures you maintain your desired profit margins.
- **Wastage Master**: Tracks allowable wastage (e.g., trimmings, spillage, spoilage) versus actual wastage. It helps owners identify where money is leaking in the kitchen.

---

## 2. Step-by-Step: Adding a New Dish

When the owner navigates to **POS > Management Mode > Add Dish (Advanced Setup)**, they go through a multi-step process that hooks into these masters.

### Step A: Basic Details (Menu & POS)
The owner enters the dish name, selling price, and category (e.g., "Chicken Biryani", ₹350, "Main Course").
* **Impact**: This adds the item to the POS grid so cashiers can sell it.

### Step B: Recipe Configuration (Costing Master)
The owner defines the **Standard Recipe** for the dish. 
* They select ingredients from the existing Inventory (e.g., 200g Rice, 150g Chicken, 1 unit Biryani Masala Premix).
* **Costing Master in Action**: The system automatically looks up the purchase cost of these ingredients in the Inventory. It calculates the `ingredientPrice` (Total Cost to Produce).
* **Margin Check**: The owner instantly sees their profit margin: `Selling Price - ingredientPrice`.

### Step C: Inventory Mapping (Inventory Master)
The owner configures how this dish is tracked physically in the kitchen.
* **Packaging / Batches**: If the dish is pre-prepped (e.g., a batch of 10 plates of Biryani kept in a container), they define `platesPerPacket` and `totalPackets`.
* **Low Stock Alerts**: They set a `lowStockThreshold`. 
* **Inventory Master in Action**: The system now knows exactly how many units of this dish are ready to serve. 

### Step D: Wastage Allowances (Wastage Master)
The owner defines the `allowedWastagePercentage` (e.g., 2%).
* **Wastage Master in Action**: It sets a baseline. If the kitchen produces 100 plates, the system expects up to 2 plates of equivalent ingredients might be wasted due to spillage or prep loss. If actual wastage entered at the end of the day exceeds this 2%, it flags the admin.

---

## 3. The Lifecycle: What Happens When the Dish is Sold?

When a cashier clicks the dish on the POS and completes a checkout:

1. **Inventory Deduction**: 
   - The Inventory Master deducts `1 Plate` from the prepared stock.
   - If the dish is made-to-order, it deducts the exact raw materials defined in the recipe (e.g., -200g Rice, -150g Chicken) from the central store.

2. **Costing & Profit Tracking**:
   - The Costing Master logs the exact profit for that specific order. If the cost of Chicken increased yesterday, the system uses the *latest moving average cost*, giving the owner real-time profit analytics on the dashboard.

3. **Wastage Auditing**:
   - At the end of the shift, the chef does a physical count. If the system says there should be 10 plates left, but there are only 9, 1 plate is logged as wastage.
   - The Wastage Master checks if this 1 plate falls within the `allowedWastagePercentage`. If it exceeds it, it shows up as a red alert in the Wastage Dashboard, allowing the owner to hold the kitchen staff accountable.

---

## 4. Summary for the Restaurant Owner

By spending an extra 2 minutes configuring the **Advanced Setup** when adding a new dish, the restaurant owner gains:
- **Zero Stock-Outs**: Automatic alerts when ingredients or prepped batches run low.
- **Profit Protection**: Real-time visibility into whether a dish is actually making money.
- **Leakage Prevention**: Mathematical proof if staff are wasting food or if portion sizes are too large.
