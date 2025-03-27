# Simple Explorer Backend API

This backend provides a RESTful API for managing folders and files in a hierarchical structure.

## Getting Started

To start the development server run:
```bash
bun install
bun run dev
```

The server will be available at http://localhost:3000/

## API Documentation

### Folder Management

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET` | `/v1/folders/` | Get root-level folders and files |
| `GET` | `/v1/folders/:id` | Get contents of a specific folder with breadcrumb navigation |
| `GET` | `/v1/folders/tree` | Get complete folder hierarchy as a tree (for special cases) |
| `POST` | `/v1/folders/` | Create a new folder |
| `POST` | `/v1/folders/:id/files` | Create a new file inside a specific folder |
| `GET` | `/v1/folders/search?q=query` | Search for folders and files by name |

### File Management

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `POST` | `/v1/files/` | Create a new file with specified folder ID |
| `GET` | `/v1/files/:id` | Get details of a specific file |
| `POST` | `/v1/files/in-folder/:folderId` | Alternative way to create a file in a folder |

## File Explorer Usage

For a typical file explorer experience:

1. Start by calling `GET /v1/folders/` to get root-level items
2. Navigate into a folder by calling `GET /v1/folders/1` (where 1 is the folder ID)
3. Use the returned breadcrumb data to provide navigation context
4. Create new folders with `POST /v1/folders/`
5. Upload files to the current folder with `POST /v1/folders/1/files`
6. Search across all items with `GET /v1/folders/search?q=query`

## Request & Response Examples

### Get Root Directory Contents

**Request:**
```
GET /v1/folders/
```

**Response:**
```json
{
  "success": true,
  "message": "Root directory contents",
  "data": {
    "folders": [
      {
        "id": 1,
        "name": "Documents",
        "parent_id": null,
        "created_at": "2023-06-15T12:00:00.000Z",
        "updated_at": "2023-06-15T12:00:00.000Z"
      },
      {
        "id": 2,
        "name": "Pictures",
        "parent_id": null,
        "created_at": "2023-06-15T12:05:00.000Z",
        "updated_at": "2023-06-15T12:05:00.000Z"
      }
    ],
    "files": [
      {
        "id": 3,
        "name": "notes.txt",
        "folder_id": null,
        "size": 256,
        "type": "text/plain",
        "created_at": "2023-06-15T12:30:00.000Z"
      }
    ]
  }
}
```

### Get Folder Contents with Breadcrumb

**Request:**
```
GET /v1/folders/3
```

**Response:**
```json
{
  "success": true,
  "message": "Contents of folder ID: 3",
  "data": {
    "folders": [
      {
        "id": 4,
        "name": "Work",
        "parent_id": 3,
        "created_at": "2023-06-15T12:10:00.000Z",
        "updated_at": "2023-06-15T12:10:00.000Z"
      }
    ],
    "files": [
      {
        "id": 2,
        "name": "resume.pdf",
        "folder_id": 3,
        "size": 2048,
        "type": "application/pdf",
        "created_at": "2023-06-15T12:30:00.000Z"
      }
    ],
    "breadcrumb": [
      {
        "id": 1,
        "name": "Documents"
      },
      {
        "id": 3,
        "name": "Projects"
      }
    ]
  }
}
```

### Create Folder

**Request:**
```json
POST /v1/folders/
{
  "name": "My Documents",
  "parent_id": null
}
```

**Response:**
```json
{
  "success": true,
  "message": "Folder created successfully",
  "data": {
    "id": 1,
    "name": "My Documents",
    "parent_id": null,
    "created_at": "2023-06-15T12:00:00.000Z",
    "updated_at": "2023-06-15T12:00:00.000Z"
  }
}
```

### Create File in Folder

**Request:**
```json
POST /v1/folders/1/files
{
  "name": "document.txt",
  "size": 1024,
  "type": "text/plain",
  "content": "Hello, world!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "File created in folder successfully",
  "data": {
    "id": 1,
    "name": "document.txt",
    "folder_id": 1,
    "size": 1024,
    "type": "text/plain",
    "created_at": "2023-06-15T12:30:00.000Z"
  }
}
```

### Search Files and Folders

**Request:**
```
GET /v1/folders/search?q=doc
```

**Response:**
```json
{
  "success": true,
  "message": "Search results for: \"doc\"",
  "data": {
    "folders": [
      {
        "id": 1,
        "name": "My Documents",
        "parent_id": null,
        "created_at": "2023-06-15T12:00:00.000Z",
        "updated_at": "2023-06-15T12:00:00.000Z"
      }
    ],
    "files": [
      {
        "id": 1,
        "name": "document.txt",
        "folder_id": 1,
        "size": 1024,
        "type": "text/plain",
        "created_at": "2023-06-15T12:30:00.000Z"
      }
    ]
  }
}
```

**Error Response (Missing Query):**
```json
{
  "success": false,
  "message": "Search query is required",
  "code": 400
}
```

## Search Functionality Notes

- The search matches any part of a file or folder name (case-sensitive)
- Results are limited to a maximum of 100 folders and 100 files (200 total items)
- Empty search queries will return a 400 error
- Results are sorted alphabetically by name
- The search operates across all folders and files in the system, regardless of their location in the hierarchy

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "code": 400
}
```

## Dependencies

- [Elysia](https://elysiajs.com/) - Fast and flexible Node.js web framework
- [Prisma](https://www.prisma.io/) - Database ORM
