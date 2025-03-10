
import reflex as rx
from typing import Dict, Any, List
from dataverse_connection import get_dataverse_connection, MACHINE_MAPPING, from_dataverse_format

# State for managing Dataverse connection testing
class DataverseTestState(rx.State):
    """State for Dataverse connection testing."""
    # Connection status
    is_connected: bool = False
    connection_message: str = ""
    
    # Data fetched from Dataverse
    machines: List[Dict[str, Any]] = []
    
    # Loading states
    is_connecting: bool = False
    is_loading_machines: bool = False
    
    # Connection test
    async def test_connection(self):
        """Test the connection to Dataverse."""
        self.is_connecting = True
        self.connection_message = "Connecting to Dataverse..."
        
        try:
            connection = get_dataverse_connection()
            connected = connection.connect()
            
            if connected:
                self.is_connected = True
                self.connection_message = "Successfully connected to Dataverse!"
            else:
                self.is_connected = False
                self.connection_message = "Failed to connect to Dataverse."
        except Exception as e:
            self.is_connected = False
            self.connection_message = f"Error connecting to Dataverse: {str(e)}"
        
        self.is_connecting = False
    
    # Fetch machines from Dataverse
    async def fetch_machines(self):
        """Fetch machines from Dataverse."""
        if not self.is_connected:
            self.connection_message = "Please connect to Dataverse first."
            return
        
        self.is_loading_machines = True
        
        try:
            connection = get_dataverse_connection()
            dataverse_machines = connection.query_records(
                entity=MACHINE_MAPPING.dataverse_entity,
                top=10
            )
            
            # Convert Dataverse format to app format
            self.machines = [
                from_dataverse_format(machine, MACHINE_MAPPING) 
                for machine in dataverse_machines
            ]
            
            self.connection_message = f"Successfully fetched {len(self.machines)} machines."
        except Exception as e:
            self.connection_message = f"Error fetching machines: {str(e)}"
            self.machines = []
        
        self.is_loading_machines = False


# Page component
def dataverse_test() -> rx.Component:
    """Dataverse connection test page."""
    return rx.vstack(
        rx.heading("Dataverse Connection Test", size="lg"),
        rx.text("Use this page to test your connection to Microsoft Dataverse."),
        
        rx.divider(),
        
        # Connection status
        rx.box(
            rx.vstack(
                rx.heading("Connection Status", size="md"),
                rx.cond(
                    DataverseTestState.is_connected,
                    rx.flex(
                        rx.icon("check-circle", color="status_active"),
                        rx.text("Connected to Dataverse", color="status_active"),
                        align_items="center",
                        gap="2",
                    ),
                    rx.flex(
                        rx.icon("x-circle", color="status_error"),
                        rx.text("Not connected", color="status_error"),
                        align_items="center",
                        gap="2",
                    ),
                ),
                rx.text(DataverseTestState.connection_message),
                rx.button(
                    "Test Connection",
                    on_click=DataverseTestState.test_connection,
                    is_loading=DataverseTestState.is_connecting,
                    is_disabled=DataverseTestState.is_connecting,
                    color_scheme="blue",
                    margin_top="4",
                ),
                align_items="start",
                width="100%",
                padding="6",
                background="white",
                border_radius="lg",
                shadow="md",
            ),
            width="100%",
            margin_top="6",
        ),
        
        # Machine data
        rx.box(
            rx.vstack(
                rx.heading("Machines from Dataverse", size="md"),
                rx.button(
                    "Fetch Machines",
                    on_click=DataverseTestState.fetch_machines,
                    is_loading=DataverseTestState.is_loading_machines,
                    is_disabled=DataverseTestState.is_loading_machines or not DataverseTestState.is_connected,
                    color_scheme="blue",
                    margin_bottom="4",
                ),
                rx.cond(
                    DataverseTestState.machines,
                    rx.table(
                        rx.thead(
                            rx.tr(
                                rx.th("Name"),
                                rx.th("Status"),
                                rx.th("IP Address"),
                                rx.th("Description"),
                            )
                        ),
                        rx.tbody(
                            rx.foreach(
                                DataverseTestState.machines,
                                lambda machine: rx.tr(
                                    rx.td(machine.get("name", "")),
                                    rx.td(machine.get("status", "")),
                                    rx.td(machine.get("ipAddress", "")),
                                    rx.td(machine.get("description", "")),
                                )
                            )
                        ),
                        width="100%",
                    ),
                    rx.text("No machines fetched yet.")
                ),
                align_items="start",
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
        padding="6",
    )

# Update the app route in main.py to include this page
