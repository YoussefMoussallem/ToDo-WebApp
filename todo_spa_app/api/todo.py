import frappe 
from frappe import _

@frappe.whitelist()
def list_todos():
    # Get all todos for the current user
    user = frappe.session.user # Get the logged-in user
    todos=frappe.get_all(
        "ToDo",
        filters={"owner":user},
        fields=["name", "description", "status","date"],
    ) # Fetch todos owned by the current user

    return todos

@frappe.whitelist()
def create_todo(description, status="Open"):
    # Create a new todo item
    user=frappe.session.user

    doc=frappe.get_doc({
        "doctype":"ToDo",
        "description":description,
        "status":status,
        "owner":user
    }) # Create a new ToDo document

    doc.insert()
    frappe.db.commit()
    return doc
    

@frappe.whitelist()
def update_todo(name, description=None,status=None):
    # Update an existing todo item if owned by user
    user = frappe.session.user
    doc = frappe.get_doc("ToDo",name) # Fetch the ToDo document by name

    if doc.owner != user:
        frappe.throw(_("Not permitted"),frappe.PermissionError) # Check ownership, and raise error if not owner
    
    # Update fields if provided
    if description is not None:
        doc.description=description
    if status is not None:
        doc.status=status

    # Save changes and commit to the database
    doc.save()
    frappe.db.commit()
    return doc

@frappe.whitelist()
def delete_todo(name):
    # Delete a todo item if owned by user
    user = frappe.session.user
    doc = frappe.get_doc("ToDo",name)

    if doc.owner != user:
        frappe.throw(_("Not permitted"),frappe.PermissionError)
    
    doc.delete()
    frappe.db.commit()
    return {"status":"success"}

    