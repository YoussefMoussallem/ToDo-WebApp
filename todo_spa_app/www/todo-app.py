import frappe

def get_context(context):
    # This ensures the user must be logged in to access the page
    if frappe.session.user == "Guest":
        frappe.throw("Please login to access this page", frappe.PermissionError)
    
    context.no_cache = 1
    return context
