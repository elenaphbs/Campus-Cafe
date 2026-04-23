import os
import pandas as pd

class Staff:
    counter = 0
    def __init__(self,name, telephone, is_admistrator = False, id = None, password = "00000000"):
        if id != None:
            self.staff_id = id
            Staff.counter = max(Staff.counter, int(id))
        else:
            Staff.counter += 1
            self.staff_id = str(Staff.counter).zfill(9)

        self.name = name
        self.telephone = telephone
        self.password = password
        self.is_administrator = is_admistrator

    def __str__(self):
        return f"* Staff ID: {self.staff_id}   Name: {self.name: <10}   Telephone: {self.telephone}\n"

    def reset_telephone(self, telephone):
        self.telephone = telephone

    def reset_password(self, password):
        self.password = password

    def change_permission(self):
        self.is_administrator = not self.is_administrator

class Staffs:
    def __init__(self, filename = "Staffs.xlsx"):
        self.filename = filename
        self.staffs = self.load_from_excel()

    def __iter__(self):
        return iter(self.staffs)

    def check_staff(self,id):
        for staff in self.staffs:
            if str(staff.staff_id) == str(id).zfill(9):
                return True
        return False

    def get_staff(self,id):
        for staff in self.staffs:
            if str(staff.staff_id) == str(id).zfill(9):
                return staff
        return None
    
    def display_staffs(self):
        for staff in self.staffs:
            print(staff)
    
    def add_staff(self, staff):
        if not self.check_staff(staff.staff_id):
            self.staffs.append(staff)

    def delete_staff(self, staff):
        self.staffs.remove(staff)

    def change_staff_permission(self, staff):
        staff.change_permission()

    def update_staff(self,staff):
        for i in range(len(self.staffs)):
            if self.staffs[i].staff_id == staff.staff_id:
                self.staffs[i] = staff

    def load_from_excel(self):
        if not os.path.exists('data/' + self.filename):
            return []

        df = pd.read_excel('data/' + self.filename)

        result = []
        for _, info in df.iterrows():
            result.append(Staff(info["name"],info["telephone"],info["is_administrator"],str(info["staff_id"]).zfill(9),info["password"]))
            Staff.counter = max(Staff.counter, int(info["staff_id"]))
        return result
    
    def save_to_excel(self):
        rows = []
        for staff in self.staffs:
            rows.append({"staff_id":staff.staff_id, "name": staff.name, "telephone":staff.telephone, "password":staff.password, "is_administrator": staff.is_administrator})
        df = pd.DataFrame(rows, columns=["staff_id","name","telephone","password","is_administrator"])
        df.to_excel('data/' + self.filename, index = False)


if __name__ == "__main__":
    elena = Staff("elena", 6693733975)
    print(elena)
    elena.reset_password("123456")
    print(elena)

    staffs = Staffs()
    print(staffs.check_staff("000000001"))
    staffs.add_staff(elena)
    print(staffs.check_staff("000000001"))
    elena = staffs.get_staff("000000001")
    elena.reset_password("abcdef")
    print(elena)
    staffs.update_staff(elena)
    staffs.save_to_excel()






