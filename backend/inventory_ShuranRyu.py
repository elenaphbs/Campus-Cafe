from backend.menu import MenuItem, Menu
import os
import pandas as pd

class Inventory:
        # Yanyan and Arja modify the constractor
    def __init__(self, filename = "Inventory.xlsx"):
        """
        Initialize the Inventory

        Args: 
            filename (string) : the filename of an excel file that we want to modify
        """
        self.filename = filename  
        self.stock = self.load_from_excel()

    def __str__(self):
        inventory = f"{'-' * 40}\n"
        for item_name, quantity in self.stock.items():
            inventory += f"* {item_name: <25}{int(quantity): >13d}\n"
        inventory += f"{'-' * 40}\n"
        return inventory
        
    def check_stock(self,item):
        """
        returns:bool
        if has stock return True, if not, return False
        """
        item_quantity = self.stock.get(item.name, 0)
        if item_quantity > 0:
            # print(f"The quantity of {item.name}: {item_quantity}")
            return True
        else:
            # print(f"{item.name} is out of stock")
            return False

    def deduct_stock(self,item):
        """
        Only call after check_stock() returns True.
        returns: None
        Reduces stock for item.name by 1.
        """
        if self.check_stock(item):
           self.stock[item.name] -= 1

    # Yanyan and Arja add one more function here
    def restore_stock(self,item):
        """
        Increase the stock of an item by 1 (used when deleting from order).

        Args:
            item (MenuItem): the menu item to restore
        """
        self.stock[item.name] += 1
        
    def restock(self, item_name:str, amount:int):
        """
        returns: None
        Increases stock for item_name by amount.
        """
        self.stock[item_name] = self.stock.get(item_name, 0) + amount

    def stock_report(self):
        """
        Prints all items and their current stock level
        """
        print(f"{'INVENTORY': ^40}")
        print(self)

    # Yanyan and Arja add one more function here
    def load_from_excel(self):
        """
        Convert the DataFrame of an excel file to an dictionary
        """
        # If the filename or sheet doesn't exist, return an empty dictionary
        if not os.path.exists('data/' + self.filename):
            return {}

        df = pd.read_excel('data/' + self.filename)

        result = {}
        for i, row in df.iterrows():
            result[row["Item Name"]] = row["Stock Numbers"]
        return result
    
    # Yanyan and Arja add one more function here
    def save_to_excel(self):
        df = pd.DataFrame(list(self.stock.items()), columns=['Item Name','Stock Numbers'])
        df.to_excel('data/' + self.filename, index = False)


if __name__ == "__main__":
    inventory = Inventory()
    print(inventory)
    inventory.stock_report()
    # inventory.save_to_excel()

    #test part
    # inv1 = Inventory()
    # sandwich = Item("Sandwich")
    # inv1.stock_report()

    # inv1.check_stock(sandwich)

    # inv1.deduct_stock(sandwich)

    # inv1.restock(sandwich.name, 10)
    # inv1.check_stock(sandwich)
    # inv1.stock_report()
    # inv1.deduct_stock(sandwich)
    # inv1.stock_report()
