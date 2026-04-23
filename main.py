from backend.menu import MenuItem, Menu
from backend.order import Order
from backend.inventory_ShuranRyu import Inventory
from backend.customer import Customer, Customers
from backend.staff import Staff, Staffs
from getpass import getpass
from datetime import datetime

MENU = Menu()
order = Order(MENU)
session_orders = {}


def main_menu():


    while True:
        print("\n" * 10)
        print(f"{'CAMPUS CAFÉ': ^40}\n")
        print(f"{'[1]': >13}  {'VIEW MENU': <23}\n\n{'[2]': >13}  {'ORDER ITEM': <23}\n\n{'[3]': >13}  {'DELETE ITEM': <23}\n\n\
{'[4]': >13}  {'VIEW CART': <23}\n\n{'[5]': >13}  {'CHECKOUT': <23}\n\n\n{'[S] STAFF': >40}\n\n")

        choice = input("Please enter your choice: ").lower()

        if choice == "1":
            view_menu()

        elif choice == "2":
            order_item()

        elif choice == "3":
            delete_item()
        
        elif choice == "4":
            view_cart()

        elif choice == "5":
            checkout()

        elif choice == "s":
            login_staff_system()
                
        else:
            print("Invalid input, please try again!")

def view_menu():
    MENU.display_menu()
    while True:
        choice1 = input("Enter R to return: ").lower()
        if choice1 == "r":
            return
        
def order_item():
    while True:
        item_name = input("Enter the name of food you would like to order or R to return: ").lower().strip()
        
        if item_name == "r":
            return

        item = MENU.get_item(item_name)

        if item is None:
            print("Invalid input, please try again!")
            continue

        while True:
            num = input(f"Enter the number of {item.name} you would like to order: ")

            try:
                num_int = int(num)
                if num_int <= 0:
                    print("Invalid input, please try again!")
                    continue
                break
            except ValueError:
                print("Invalid input, please try again!")
                continue

        inventory = Inventory()    
        counter = 0
        for i in range(num_int):
            if inventory.check_stock(item):
                counter += 1
                order.add_to_order(item)
                inventory.deduct_stock(item)
                inventory.save_to_excel()
            else:
                print("Sorry, this item is out of stock, please choose other item.")
                break
        print(f"You have ordered {counter} {item.name}.")

def delete_item():
    while True:
        name = input("Enter the name of the food you would like to delete or R to return: ").lower().strip()
        if name == "r":
            return

        item = MENU.get_item(name)

        if item is None:
            print("Invalid input, please try again!")
            continue
        
        if item in order.items:
            while True:
                num = input(f"Enter the number of {item.name} you would like to delete: ")

                try:
                    num_int = int(num)
                    if num_int <= 0:
                        print("Invalid input, please try again!")
                        continue
                    break
                except ValueError:
                    print("Invalid input, please try again!")
                    continue
            
            num_max = min(num_int, order.get_items_num()[item])
            for i in range(num_max):
                order.remove_from_order(item)
                inventory = Inventory()
                inventory.restore_stock(item)
                inventory.save_to_excel()
            print(f"You have deleted {num_max} {item.name}.")

        else:
            print("You didn't order this item or you have already deleted all of this item.")

def view_cart():
    print(f"{'YOUR ORDER': ^40}")
    order.display_order()
    while True:
        choice1 = input("Enter R to return: ").lower()
        if choice1 == "r":
            return
        
def checkout():
    if len(order.items) == 0:
        print("Sorry, you didn't order anything.")
        return

    else:
        # Calculate total consuming
        subtotal = order.get_total()
        total_before_tax = order.get_total_after_discount()
        discount = subtotal - total_before_tax
        tax = order.TAX_RATE * total_before_tax
        total = total_before_tax + tax

        # Get valid telephone number
        while True:
            telephone = input("Enter your telephone number: ")

            try:
                telephone_int = int(telephone)
                if telephone_int <= 0:
                    print("Invalid input, please try again.")
                    continue
                break
            except ValueError:
                print("Invalid input, please try again.")

        # Earn loyalty points
        customers = Customers()
        if customers.check_customer(telephone_int):
            customer = customers.get_customer(telephone_int)
            customer.display_points()

            while True:
                pay_method = input("Enter 'C' to pay by cash or 'L' to use your loyalty point: ").lower().strip()
                if pay_method == "c":
                    break
                elif pay_method == "l":
                    customer.use_points(total)
                    break
                else:
                    print("Invalid input, please try again.")
                    continue

            customer.earn_points(total)
            customers.update_customer(customer)
        else:
            customer = Customer(telephone_int)
            customer.earn_points(total)
            customers.add_customer(customer)

        customers.save_to_excel()

        # Receive money
        print("Money received.")
        print()
        # Print receipt
        print("=" * 40)
        print()
        print(f"{'CAMPUS CAFE': ^40}")
        print()
        print(f"{'4 N Second Street, San Jose, CA 95113': ^40}")
        print()
        print("-" * 40)
        print(f"Date: {datetime.now().strftime('%Y-%m-%d'): <20}Time: {datetime.now().strftime('%H:%M:%S')}")
        print(f"Customer ID: {customer.customer_id}    Points: {customer.points}")
        order.display_order()
        print(f"{'Subtotal:': <35}${subtotal:.2f}")
        print("-" * 40)
        if discount != 0:
            print(f"{'Daily special discount:': <35}${discount:.2f}")
        print(f"{'Tax:': <35}${tax:.2f}")
        print("-" * 40)
        print(f"{'Total:': <35}${total:.2f}")
        print("-" * 40)
        print(f"{'Thank you for dining with us!': ^40}")
        print("=" * 40)

        order.save_to_excel()
        session_orders[len(session_orders)] = {"Total": total, "Items": str(order)}
        order.clear_order()
        

def login_staff_system():
    staffs = Staffs()

    while True:
        id = input("Enter your staff id or R to return: ").lower()

        if id == "r":
            return
        
        if not staffs.check_staff(id):
            print("Invalid input, please try again.")
            continue
        else:
            staff = staffs.get_staff(id)

            while True:
                pwd = getpass("Enter the password or R to return:")
                print()


                if pwd == "r":
                    return

                elif pwd == staff.password:

                    if staff.is_administrator == True:
                        administrator_menu(staffs, staff)
                    else:
                        staff_menu(staffs, staff)
                    return      

                else:
                    print("Invalid input, please try again!")

def administrator_menu(staffs, staff):
    while True:
        print("\n"*10)
        print(f"{'ADMINISTRATOR SYSTEM': ^40}\n")
        print(f"{'[1]': >13}  {'VIEW INVENTORY': <23}\n\n{'[2]': >13}  {'RESTOCK INVENTORY': <23}\n\n\
{'[3]': >13}  {'VIEW STAFFS': <23}\n\n{'[4]': >13}  {'CHANGE STAFF PERMISSION': <23}\n\n{'[5]': >13}  {'ADD NEW STAFF': <23}\n\n{'[6]': >13}  {'DELETE STAFF': <23}\n\n\
{'[7]': >13}  {'SETTING': <23}\n\n{'[Q]': >13}  {'QUIT': <23}\n\n\n\{'[R] RETURN': >40}\n\n")
        choice = input("Please enter your choice: ").lower()

        if choice == "1":
            view_inventory()

        elif choice == "2":
            restock_inventory()

        elif choice == "3":
            view_staffs(staffs)

        elif choice == "4":
            change_staff_permission(staffs)

        elif choice == "5":
            add_staff(staffs)

        elif choice == "6":
            delete_staff(staffs)

        elif choice == "7":
            setting(staffs, staff)

        elif choice == "q":
            quit()

        elif choice == "r":
            return    

        else:
            print("Invalid input, please try again!")

def staff_menu(staffs, staff):
    while True:
        print("\n"*10)
        print(f"{'STAFF SYSTEM': ^40}\n")
        print(f"{'[1]': >13}  {'VIEW INVENTORY': <23}\n\n{'[2]': >13}  {'RESTOCK INVENTORY': <23}\n\n\
{'[3]': >13}  {'SETTING': <23}\n\n{'[Q]': >13}  {'QUIT': <23}\n\n\n\{'[R] RETURN': >40}\n\n")
        choice = input("Please enter your choice: ").lower()

        if choice == "1":
            view_inventory()

        elif choice == "2":
            restock_inventory()

        elif choice == "3":
            setting(staffs, staff)

        elif choice == "q":
            quit()

        elif choice == "r":
            return    

        else:
            print("Invalid input, please try again!")

def view_staffs(staffs):
    staffs.display_staffs()
    while True:
        choice = input("Enter R to return: ").lower()
        if choice == "r":
            break

def change_staff_permission(staffs):
    while True:
        staff_id = input("Enter the id of the staff you want to change: ")
        if staff_id == "r":
            return
        
        found_staff = False
        for staff in staffs:
            if staff.staff_id == staff_id:
                staffs.change_staff_permission(staff)
                staffs.update_staff(staff)
                staffs.save_to_excel()
                if staff.is_administrator == True:
                    print(f"Staff {staff.name}({staff.staff_id}) has become the administrator.\n")
                else:
                    print(f"Staff {staff.name}({staff.staff_id}) is no longer the administrator.\n")
                found_staff = True

        if not found_staff:
            print("The staff ID doesn't exist, please try again.")
    

def add_staff(staffs):
    while True:
        staff_telephone = input("Enter the telephone number of the new staff you want to add or R to return: ").strip()
        if staff_telephone == "r":
            return
        
        try:
            staff_telephone_int = int(staff_telephone)
            if staff_telephone_int <= 0:
                print("Invalid input, please try again.")
                continue
        except ValueError:
            print("Invalid input, please try again.")
            continue
        
        for staff in staffs:
            if staff.telephone == staff_telephone_int:
                print("The staff already exists, please try again.")
        
        staff_name = input("Enter the name of the new staff or R to return: ").title().strip()
        if staff_name == "R":
            return
        
        staff = Staff(staff_name, staff_telephone_int)
        staffs.add_staff(staff)
        staffs.update_staff(staff)
        staffs.save_to_excel()
        print(f"You have added a new staff.\n{str(staff)}")
    

def delete_staff(staffs):
    while True:
        staff_id = input("Enter the id of the staff you want to delete or R to return: ")
        if staff_id == "r":
            return
        
        found_staff = False
        for staff in staffs:
            if staff.staff_id == staff_id:
                found_staff = True
                staffs.delete_staff(staff)
                staffs.save_to_excel()
                print(f"You have deleted a staff.\n{str(staff)}")
            
        
        if not found_staff:
            print("The staff id doesn't exist, please try again.")
        continue

def view_inventory():
    inventory = Inventory()
    inventory.stock_report()
    while True:
        choice = input("Enter R to return ").lower()
        if choice == "r":
            break

def restock_inventory():
    inventory = Inventory()
    while True:
        name = input("Enter the name of the food you would like to restock or R to return: ").strip().title()
        if name == "R":
            break

        if name not in inventory.stock:
            print("Invalid input, please try again!")
            continue
        else:
            while True:
                num = input(f"Enter the number of {name} you would like to restock: ")

                try:
                    num_int = int(num)

                    if num_int <= 0:
                        print("Invalid input, please try again!")
                        continue

                    inventory.restock(name,num_int)
                    inventory.save_to_excel()
                    print(f"You have restocked {num_int} {name}s.")
                    break
        
                except ValueError:
                    print("Invalid input, please try again!")
                    continue

def setting(staffs, staff):
    while True:
        print("\n"*10)
        print(f"{'SETTING': ^40}\n")
        print(f"{'[1]': >13}  {'RESET TELEPHONE NUMBER': <23}\n\n{'[2]': >13}  {'RESET PASSWORD': <23}\
    \n\n\n\{'[R] RETURN': >40}\n\n")
        choice = input("Enter your choice: ").lower()

        if choice == "1":
            while True:
                new_phone = input("Enter your new telephone number: ").strip()

                try:
                    new_phone_int = int(new_phone)
                    if new_phone_int <=0:
                        print("Invalid input, please try again.")
                        continue
                    staff.reset_telephone(new_phone_int)
                    staffs.update_staff(staff)
                    staffs.save_to_excel()
                    print("You have reset your telephone number.")
                    break
                except ValueError:
                    print("Invalid input, please try again.")
                    continue

        elif choice == "2":
            while True:
                print()
                new_pwd = getpass(f"{'* Password must contain at least 10 characters.'}\n\
{'* Password must contain at least one uppercase letter.'}\n{'* Password must contain at least one digit.'}\n\
{'Enter your new password: '}").strip()

                if len(new_pwd) < 10:
                    print("Password should be at least 10 characters, please try again.")
                    continue

                has_upper = False
                for ch in new_pwd:
                    if ch.isupper():
                        has_upper = True
                        break
                
                if not has_upper:
                    print("Password must contain at least one uppercase letter, please try again.")
                    continue

                has_digit = False
                for ch in new_pwd:
                    if ch in '0123456789':
                        has_digit = True
                        break

                if not has_digit:
                    print("Password must contain at least one digit, please try again.")
                    continue

                staff.reset_password(new_pwd)
                staffs.update_staff(staff)
                staffs.save_to_excel()
                print("You have reset your password.")
                break

        elif choice == "r":
            return
        
        else:
            print("Invalid input, please try again.")
            continue
        

def quit():
    print("\n"*10)
    print(f"{'CAMPUS CAFÉ': ^40}")
    session_orders_total = 0
    for _, info in session_orders.items():
        session_orders_total += info["Total"]
        print(info["Items"])


    print(f"{len(session_orders)} orders completed, {session_orders_total:.2f} dollars earned.")

    exit()

if __name__ == "__main__":

    main_menu()









            







