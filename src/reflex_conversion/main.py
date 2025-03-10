
import reflex as rx
from typing import List, Optional

# Define theme and styles similar to our Tailwind setup
class AutomationTheme(rx.Theme):
    text_colors: dict = {
        "DEFAULT": "#1F2937",  # Dark gray
        "white": "#FFFFFF",
        "status_active": "#10B981",  # Green
        "status_idle": "#6B7280",    # Gray
        "status_error": "#EF4444",   # Red
        "status_warning": "#F59E0B", # Amber
        "status_pending": "#3B82F6", # Blue
    }
    
    background_colors: dict = {
        "DEFAULT": "#F9FAFB",        # Light gray
        "dark": "#111827",           # Dark gray/black
        "sidebar": "#1F2937",        # Dark gray
        "white": "#FFFFFF",
        "gray100": "#F3F4F6",
        "gray800": "#1F2937",
        "gray900": "#111827",
    }

# State management for the application
class State(rx.State):
    """The app state."""
    # Sidebar state
    is_sidebar_open: bool = True
    is_mobile_menu_open: bool = False
    
    def toggle_sidebar(self):
        """Toggle the sidebar."""
        self.is_sidebar_open = not self.is_sidebar_open
    
    def toggle_mobile_menu(self):
        """Toggle the mobile menu."""
        self.is_mobile_menu_open = not self.is_mobile_menu_open

# Define common components
def navbar() -> rx.Component:
    """The top navigation bar."""
    return rx.hstack(
        rx.hstack(
            rx.icon("activity", color="status_active"),
            rx.text("Automation Conductor", font_weight="bold", font_size="xl"),
            spacing="2",
            on_click=lambda: rx.redirect("/"),
            cursor="pointer",
        ),
        
        # Mobile menu button (only visible on small screens)
        rx.button(
            rx.cond(
                State.is_mobile_menu_open,
                rx.icon("x"),
                rx.icon("menu")
            ),
            variant="ghost",
            on_click=State.toggle_mobile_menu,
            display=["block", "block", "none", "none"],  # Mobile only
        ),
        
        # Desktop navigation links (hidden on mobile)
        rx.hstack(
            rx.link(
                rx.hstack(rx.icon("activity"), rx.text("Dashboard"), spacing="2"),
                href="/",
                color="white",
                _hover={"color": "status_active"},
                transition="colors",
            ),
            rx.link(
                rx.hstack(rx.icon("laptop"), rx.text("Machines"), spacing="2"),
                href="/machines",
                color="white",
                _hover={"color": "status_active"},
                transition="colors",
            ),
            rx.link(
                rx.hstack(rx.icon("play"), rx.text("Processes"), spacing="2"),
                href="/processes",
                color="white",
                _hover={"color": "status_active"},
                transition="colors",
            ),
            spacing="6",
            display=["none", "none", "flex", "flex"],  # Desktop only
        ),
        justify="space-between",
        width="100%",
        padding="4",
        background="gray900",
        color="white",
        shadow="md",
    )

def mobile_menu() -> rx.Component:
    """Mobile navigation menu."""
    return rx.box(
        rx.vstack(
            rx.link(
                rx.hstack(rx.icon("activity"), rx.text("Dashboard"), spacing="2"),
                href="/",
                width="100%",
                padding="2",
                padding_x="4",
                border_radius="md",
                _hover={"background": "gray800"},
                on_click=lambda: setattr(State, "is_mobile_menu_open", False),
            ),
            rx.link(
                rx.hstack(rx.icon("laptop"), rx.text("Machines"), spacing="2"),
                href="/machines",
                width="100%",
                padding="2",
                padding_x="4",
                border_radius="md",
                _hover={"background": "gray800"},
                on_click=lambda: setattr(State, "is_mobile_menu_open", False),
            ),
            rx.link(
                rx.hstack(rx.icon("play"), rx.text("Processes"), spacing="2"),
                href="/processes",
                width="100%",
                padding="2",
                padding_x="4",
                border_radius="md",
                _hover={"background": "gray800"},
                on_click=lambda: setattr(State, "is_mobile_menu_open", False),
            ),
            spacing="4",
            align_items="stretch",
            padding="4",
            background="gray800",
            border_radius="md",
        ),
        display=rx.cond(
            State.is_mobile_menu_open,
            "block",
            "none"
        ),
        margin_top="4",
        background="gray800",
        padding_bottom="2",
    )

def sidebar() -> rx.Component:
    """The application sidebar."""
    return rx.box(
        rx.vstack(
            # Sidebar header
            rx.hstack(
                rx.heading("Navigation", size="sm", color="white"),
                rx.spacer(),
                rx.button(
                    rx.icon("chevron-left"),
                    variant="ghost",
                    color="white",
                    on_click=State.toggle_sidebar,
                ),
                width="100%",
                padding="4",
                border_bottom="1px solid",
                border_color="gray800",
            ),
            
            # Sidebar content
            rx.vstack(
                rx.text("Application", font_size="xs", color="gray400", font_weight="medium"),
                
                rx.vstack(
                    rx.link(
                        rx.hstack(rx.icon("home"), rx.text("Dashboard"), spacing="3"),
                        href="/",
                        width="100%",
                        padding="2",
                        border_radius="md",
                        _hover={"background": "gray800"},
                    ),
                    rx.link(
                        rx.hstack(rx.icon("laptop"), rx.text("Machines"), spacing="3"),
                        href="/machines",
                        width="100%",
                        padding="2",
                        border_radius="md",
                        _hover={"background": "gray800"},
                    ),
                    rx.link(
                        rx.hstack(rx.icon("play"), rx.text("Processes"), spacing="3"),
                        href="/processes",
                        width="100%",
                        padding="2",
                        border_radius="md",
                        _hover={"background": "gray800"},
                    ),
                    width="100%",
                    align_items="stretch",
                    spacing="1",
                ),
                
                rx.spacer(),
                
                # Settings section
                rx.vstack(
                    rx.text("Settings", font_size="xs", color="gray400", font_weight="medium"),
                    rx.link(
                        rx.hstack(rx.icon("settings"), rx.text("Settings"), spacing="3"),
                        href="/settings",
                        width="100%",
                        padding="2",
                        border_radius="md",
                        _hover={"background": "gray800"},
                    ),
                    width="100%",
                    align_items="stretch",
                    spacing="1",
                ),
                
                width="100%",
                height="100%",
                align_items="stretch",
                padding="4",
                spacing="6",
            ),
            
            # Sidebar footer
            rx.hstack(
                rx.avatar(name="User"),
                rx.vstack(
                    rx.text("Admin User", font_weight="medium"),
                    rx.text("admin@example.com", font_size="xs", color="gray400"),
                    align_items="start",
                    spacing="0",
                ),
                width="100%",
                padding="4",
                border_top="1px solid",
                border_color="gray800",
            ),
            
            align_items="stretch",
            height="100%",
            background="sidebar",
            color="white",
            width=rx.cond(State.is_sidebar_open, "250px", "0px"),
            transition="width 0.3s",
            overflow="hidden",
        ),
        height="100vh",
        display=["none", "none", "block", "block"],  # Hide on mobile
    )

def footer() -> rx.Component:
    """The application footer."""
    return rx.box(
        rx.text(
            f"Automation Conductor © {rx.now().year} - Orchestrating your workflows",
            font_size="sm",
            color="gray400",
        ),
        background="gray800",
        padding_y="4",
        padding_x="6",
        text_align="center",
    )

def layout(content: rx.Component) -> rx.Component:
    """The main layout component that includes navbar, sidebar, and footer."""
    return rx.box(
        rx.vstack(
            navbar(),
            rx.cond(
                State.is_mobile_menu_open,
                mobile_menu(),
                rx.fragment(),
            ),
            rx.hstack(
                rx.cond(
                    State.is_sidebar_open,
                    sidebar(),
                    rx.fragment(),
                ),
                rx.box(
                    content,
                    padding="6",
                    flex="1",
                ),
                width="100%",
                flex="1",
                align_items="stretch",
            ),
            footer(),
            min_height="100vh",
            spacing="0",
        ),
        background="gray100",
        dark_background="gray900",
        color="DEFAULT",
        dark_color="white",
    )

# Example page content to test the layout
def index() -> rx.Component:
    return rx.vstack(
        rx.heading("Dashboard", size="lg"),
        rx.text("Welcome to the Automation Conductor"),
        rx.box(
            rx.vstack(
                rx.heading("System Overview", size="md"),
                rx.text("Your automation system is running smoothly."),
                width="100%",
                padding="6",
                background="white",
                border_radius="lg",
                shadow="md",
            ),
            width="100%",
            margin_top="6",
        ),
        align_items="start",
        spacing="4",
    )

# Create and configure the app
app = rx.App(theme=AutomationTheme)

# Define pages
app.add_page(index, route="/", title="Dashboard - Automation Conductor")

# Add more pages here as we convert more of the application

# Run the app
if __name__ == "__main__":
    app.compile()
