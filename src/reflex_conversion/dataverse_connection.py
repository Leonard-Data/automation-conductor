
import os
import requests
from typing import Dict, Any, Optional, List
from dataclasses import dataclass
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

@dataclass
class DataverseConfig:
    """Configuration for Dataverse connection."""
    url: str
    api_version: str = "9.2"
    auth_type: str = "oauth"  # or "key"
    client_id: Optional[str] = None
    client_secret: Optional[str] = None
    tenant_id: Optional[str] = None
    api_key: Optional[str] = None
    
    def __post_init__(self):
        # Ensure URL doesn't end with a slash
        if self.url.endswith("/"):
            self.url = self.url[:-1]
            
        # Validate auth configuration
        if self.auth_type == "oauth":
            if not all([self.client_id, self.client_secret, self.tenant_id]):
                raise ValueError("OAuth auth type requires client_id, client_secret, and tenant_id")
        elif self.auth_type == "key":
            if not self.api_key:
                raise ValueError("Key auth type requires api_key")


@dataclass
class ColumnMapping:
    """Mapping between application model fields and Dataverse column names."""
    dataverse_entity: str  # The Dataverse entity/table name
    field_mappings: Dict[str, str]  # app_field_name: dataverse_column_name


class DataverseConnection:
    def __init__(self, config: DataverseConfig):
        self.config = config
        self.token = None
        self.token_expires = 0
    
    def connect(self) -> bool:
        """Establish connection to Dataverse API and authenticate."""
        try:
            if self.config.auth_type == "oauth":
                self._get_oauth_token()
            # For API key, we don't need to authenticate in advance
            return True
        except Exception as e:
            print(f"Failed to connect to Dataverse: {str(e)}")
            return False
    
    def _get_oauth_token(self):
        """Get OAuth token for authentication."""
        token_url = f"https://login.microsoftonline.com/{self.config.tenant_id}/oauth2/token"
        
        payload = {
            'client_id': self.config.client_id,
            'client_secret': self.config.client_secret,
            'resource': self.config.url,
            'grant_type': 'client_credentials'
        }
        
        response = requests.post(token_url, data=payload)
        
        if response.status_code == 200:
            token_data = response.json()
            self.token = token_data['access_token']
            import time
            self.token_expires = time.time() + token_data['expires_in']
        else:
            raise Exception(f"Failed to obtain OAuth token: {response.text}")
    
    def _get_headers(self):
        """Get HTTP headers for Dataverse API requests."""
        if self.config.auth_type == "oauth":
            # Check if token is expired
            import time
            if time.time() > self.token_expires - 60:  # Refresh if within 1 minute of expiry
                self._get_oauth_token()
                
            return {
                'Authorization': f'Bearer {self.token}',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0'
            }
        else:  # api_key
            return {
                'Authorization': f'Bearer {self.config.api_key}',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0'
            }
            
    def query_records(self, entity: str, select: Optional[List[str]] = None, 
                      filter_query: Optional[str] = None, top: int = 50) -> List[Dict[str, Any]]:
        """Query records from a Dataverse entity/table."""
        url = f"{self.config.url}/api/data/v{self.config.api_version}/{entity}"
        
        params = {'$top': top}
        
        if select:
            params['$select'] = ','.join(select)
            
        if filter_query:
            params['$filter'] = filter_query
        
        response = requests.get(url, headers=self._get_headers(), params=params)
        
        if response.status_code == 200:
            data = response.json()
            return data.get('value', [])
        else:
            raise Exception(f"Failed to query records: {response.text}")
    
    def create_record(self, entity: str, data: Dict[str, Any]) -> str:
        """Create a new record in the specified entity/table."""
        url = f"{self.config.url}/api/data/v{self.config.api_version}/{entity}"
        
        response = requests.post(url, headers=self._get_headers(), json=data)
        
        if response.status_code == 204:
            # Entity created successfully, get the ID from the response headers
            entity_id = response.headers.get('OData-EntityId')
            if entity_id:
                # Extract the GUID from the URL format
                import re
                match = re.search(r'\((.*?)\)', entity_id)
                if match:
                    return match.group(1)
            return "Record created, ID not returned"
        else:
            raise Exception(f"Failed to create record: {response.text}")
    
    def update_record(self, entity: str, record_id: str, data: Dict[str, Any]) -> bool:
        """Update an existing record in the specified entity/table."""
        url = f"{self.config.url}/api/data/v{self.config.api_version}/{entity}({record_id})"
        
        response = requests.patch(url, headers=self._get_headers(), json=data)
        
        if response.status_code == 204:
            return True
        else:
            raise Exception(f"Failed to update record: {response.text}")
    
    def delete_record(self, entity: str, record_id: str) -> bool:
        """Delete a record from the specified entity/table."""
        url = f"{self.config.url}/api/data/v{self.config.api_version}/{entity}({record_id})"
        
        response = requests.delete(url, headers=self._get_headers())
        
        if response.status_code == 204:
            return True
        else:
            raise Exception(f"Failed to delete record: {response.text}")


# Example mappings for Machine and Process entities
MACHINE_MAPPING = ColumnMapping(
    dataverse_entity="ac_machines",
    field_mappings={
        "id": "ac_machineid",
        "name": "ac_name",
        "status": "ac_status",
        "ipAddress": "ac_ipaddress",
        "lastSeen": "ac_lastseen",
        "description": "ac_description",
        "processCount": "ac_processcount",
        "cpuUsage": "ac_cpuusage",
        "memoryUsage": "ac_memoryusage"
    }
)

PROCESS_MAPPING = ColumnMapping(
    dataverse_entity="ac_processes",
    field_mappings={
        "id": "ac_processid",
        "name": "ac_name",
        "status": "ac_status",
        "machineId": "ac_machineid",
        "startTime": "ac_starttime",
        "endTime": "ac_endtime",
        "duration": "ac_duration",
        "description": "ac_description",
        "type": "ac_type"
    }
)


# Helper function to get a DataverseConnection instance from environment variables
def get_dataverse_connection() -> DataverseConnection:
    """Create a DataverseConnection using environment variables."""
    auth_type = os.getenv("DATAVERSE_AUTH_TYPE", "oauth")
    
    config = DataverseConfig(
        url=os.getenv("DATAVERSE_URL", ""),
        api_version=os.getenv("DATAVERSE_API_VERSION", "9.2"),
        auth_type=auth_type
    )
    
    if auth_type == "oauth":
        config.client_id = os.getenv("DATAVERSE_CLIENT_ID")
        config.client_secret = os.getenv("DATAVERSE_CLIENT_SECRET")
        config.tenant_id = os.getenv("DATAVERSE_TENANT_ID")
    else:
        config.api_key = os.getenv("DATAVERSE_API_KEY")
    
    return DataverseConnection(config)


# Helper function to transform data between app models and Dataverse
def to_dataverse_format(data: Dict[str, Any], mapping: ColumnMapping) -> Dict[str, Any]:
    """Convert application data to Dataverse format based on column mapping."""
    result = {}
    for app_field, dataverse_field in mapping.field_mappings.items():
        if app_field in data:
            result[dataverse_field] = data[app_field]
    return result


def from_dataverse_format(data: Dict[str, Any], mapping: ColumnMapping) -> Dict[str, Any]:
    """Convert Dataverse data to application format based on column mapping."""
    result = {}
    reverse_mapping = {dv: app for app, dv in mapping.field_mappings.items()}
    
    for dataverse_field, value in data.items():
        if dataverse_field in reverse_mapping:
            result[reverse_mapping[dataverse_field]] = value
    
    return result
