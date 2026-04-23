from menu import MENU
import random

class Inventory:
    """
    Manages stock levels for all menu items.
    """

    def __init__(self, stock):
        """
        Initialize the Inventory.

        Args:
            stock (dict): a dictionary mapping MenuItem to quantity (int)
        """
        self.stock = stock

    def check_stock(self, item):
        """
        Return True if the item is in stock, False otherwise.

        Args:
            item (MenuItem): the menu item to check

        Returns:
            bool: True if stock > 0, False otherwise
        """
        return self.stock.get(item, 0) > 0
    
    def deduct_stock(self, item):
        """
        Decrease the stock of an item by 1 (if in stock).

        Args:
            item (MenuItem): the menu item to deduct
        """
        if self.check_stock(item):
            self.stock[item] -= 1
    
    def restore_stock(self, item):
        """
        Increase the stock of an item by 1 (used when deleting from order).

        Args:
            item (MenuItem): the menu item to restore
        """
        self.stock[item] += 1

    def restock(self, item_name, amount):
        """
        Add a specified amount of stock to an item by name.

        Args:
            item_name (str): the name of the item to restock
            amount (int): the number of units to add
        """
        item = MENU.get_item(item_name)
        self.stock[item] += amount

    def stock_report(self):
        """
        Print the current stock levels of all items.
        """
        print(f"{'Inventory':=^30}")
        for item in self.stock:
            print(f"{item.name:-<25}{self.stock[item]:->5}")
        print()

stock = {item: random.randint(1, 10) for item in MENU.menu}
INVENTORY = Inventory(stock)


if __name__ == "__main__":
    INVENTORY.stock_report()

    j = MENU.get_item("j")
    INVENTORY.check_stock(j)

    Cola = MENU.get_item("cola")
    INVENTORY.deduct_stock(Cola)
    INVENTORY.restore_stock(Cola)

    INVENTORY.restock("Cola", 10)

    INVENTORY.stock_report()

