from backend.menu import MenuItem, Menu
from datetime import datetime
import pandas as pd
import os


class Order:
    """
    Represents a customer's order, storing items and handling checkout.
    """

    def __init__(self, menu, filename = "Orders.xlsx"):
        self.filename = filename
        self.items = []   # list of MenuItem objects in the order
        self.menu = menu
        self.TAX_RATE = 0.1 # 10% tax rate


    def __str__(self):
        """
        Return a formatted string of the order with item names, quantities, and prices.

        Returns:
            str: formatted order string with item names, quantities, and prices
        """
        order =  f"{'-' * 40}\n  {'Item': <26}{'Num'}{'Price': >8}\n{'-' * 40}\n"


        # Build the formatted order string
        for item in self.get_items_num().keys():
            order += f"* {item.name: <25}  {self.get_items_num()[item]}    ${item.price * self.get_items_num()[item]: >5.2f}\n"
        
        order += f"{'-' * 40}\n"
       
        return order

    def add_to_order(self, item):
        """
        Add a MenuItem to the order.

        Args:
            item (MenuItem): the menu item to add
        """
        self.items.append(item)

    def remove_from_order(self, item):
        """
        Remove one instance of a MenuItem from the order.

        Args:
            item (MenuItem): the menu item to remove
        """
        self.items.remove(item)

    def get_total(self):
        """
        Calculate and return the subtotal (before tax) of all items.

        Returns:
            float: the subtotal price before tax
        """
        total = 0.00
        for item in self.items:
            total += item.price
        return total
    
    def get_total_after_discount(self):
        """
        Calculate and return the subtotal (before tax) of all items.

        Returns:
            float: the subtotal price before tax
        """
        total = 0.00
        for item in self.items:
            if item == self.menu.special_item:
                total += item.price * (1-self.menu.special_discounted_rate)
            else:
                total += item.price
        return total

    def display_order(self):
        """
        Print the order summary to the console.
        """
        print(self)

    def clear_order(self):
        """
        Clear all items from the order.
        """
        self.items = []

    def get_items_num(self):
        item_counter = {}

        # Count the quantity of each item
        for item in self.items:
            if item not in item_counter.keys():
                item_counter[item] = 1
            else:
                item_counter[item] += 1

        return item_counter

    def save_to_excel(self):
        if len(self.items) > 0:
        
            if os.path.exists('data/' + self.filename):
                df_old = pd.read_excel('data/' + self.filename)
                order_id = df_old["order_id"].max() + 1
            else:
                order_id = 1

            row = {"order_id": order_id, "total":self.get_total_after_discount()*(self.TAX_RATE+1),"date":datetime.now().strftime('%Y-%m-%d'),"time":datetime.now().strftime('%H:%M:%S')}
            for item in self.items:
                if item.name not in row.keys():
                    row[item.name] = 1
                else:
                    row[item.name] += 1
            df = pd.DataFrame([row])

            if os.path.exists('data/' + self.filename):
                df = pd.concat([df_old, df], ignore_index=True)
            df.to_excel('data/' + self.filename, index=False)

if __name__ == "__main__":
    MENU = Menu()
    order = Order(MENU)
    americano = MENU.get_item("Americano")
    chicken_salad = MENU.get_item("chicken salad")

    order.add_to_order(americano)
    order.add_to_order(americano)
    order.add_to_order(chicken_salad)
    order.remove_from_order(americano)
    print(order.get_items_num()[americano])
    # print(order)
    # order.get_total()
    order.display_order()
    # order.save_to_excel()
    # order.clear_order()
    # order.display_order()
    order.save_to_excel()








