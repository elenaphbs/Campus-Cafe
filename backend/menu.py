import matplotlib.pyplot as plt
import os
import pandas as pd
import random


class MenuItem:
    """
    Represents a single menu item with name, price, and category.
    """

    def __init__(self, name, price, category):
        """
        Initialize a MenuItem.

        Args:
            name (str): the name of the item
            price (float): the price of the item
            category (str): the category (e.g. "Drinks", "Desserts")
        """

        self.name = name
        self.price = price
        self.category = category

    def __str__(self):
        """
        Return formatted string: index, name, and price.

        Returns:
            str: formatted string like "1 Americano          $5.00"
        """
        return f"{self.name: <34}${self.price: >5.2f}\n"


class Menu:
    """
    Represents the full cafe menu, supporting display, search, and plotting.
    """

    def __init__(self, filename="Menu.xlsx", rate = 0.2):
        """
        Initialize the Menu.

        Args:
            menu (list): a list of MenuItem objects
        """
        self.filename = filename
        self.menu = self.load_from_excel()
        self.special_item = self.daily_special()
        self.special_discounted_rate = rate

    def __str__(self):
        result = f"{'MENU':=^40}\n"
        result += f"{'Drinks':-^40}\n"
        for item in self.menu:
            if item.category == "Drinks":
                result += str(item)
        result += f"{'-' * 40}\n\n"

        result += f"{'Desserts':-^40}\n"
        for item in self.menu:
            if item.category == "Desserts":
                result += str(item)
        result += f"{'-' * 40}\n\n"

        result += f"{'Salads':-^40}\n"
        for item in self.menu:
            if item.category == "Salads":
                result += str(item)
        result += f"{'-' * 40}\n\n"

        result += f"{'Sandwiches':-^40}\n"
        for item in self.menu:
            if item.category == "Sandwiches":
                result += str(item)
        result += f"{'-' * 40}\n"

        result += f"Daily special: {self.special_item.name}\n"
        result += f"Discounted rate: {self.special_discounted_rate:.0%}\n"
        result += f"{'=' * 40}\n"
        return result

    def display_menu(self):
        """
        Print the menu to the console, grouped by category.
        """
        print(self)

    def get_item(self, name):
        """
        Search for a menu item by name (case-insensitive, ignores spaces).

        Args:
            name (str): the name of the item to search for

        Returns:
            MenuItem or None: the matching item, or None if not found
        """
        for item in self.menu:
            if item.name.lower().strip().replace(" ", "") == name.lower().strip().replace(" ", ""):
                return item
        return None
    
    def daily_special(self):
        special = random.choice(self.menu)
        return special

    def load_from_excel(self):
        if not os.path.exists('data/' + self.filename):
            return []

        df = pd.read_excel('data/' + self.filename)
        menu = []
        for _, row in df.iterrows():
            menu.append(MenuItem(row["item_name"], row["price"], row["category"]))
        
        return menu
    
    def save_to_excel(self):
        rows = []
        for item in self.menu:
            rows.append([item.name,item.price,item.category])
        df = pd.DataFrame(rows, columns= ["item_name", "price", "category"])
        df.to_excel('data/' + self.filename, index=False)


if __name__ == "__main__":
    MENU = Menu()
    MENU.display_menu()
    print()
    print(MENU.get_item("fruitsalad"))
    print()
    item, price = MENU.daily_special()
    print(item, price)





