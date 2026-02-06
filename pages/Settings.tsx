import React, { useState } from "react";
import {
  FolderOpen,
  Trash2,
  AlertCircle,
  Upload,
  FileJson,
  CheckCircle,
  LogOut,
} from "lucide-react";
import { Category, Bookmark } from "../types";
import { useAuth } from "../contexts/AuthContext";

interface SettingsProps {
  categories: Category[];
  onDeleteCategory: (categoryId: string) => void;
  onImportBookmarks: (bookmarks: Partial<Bookmark>[]) => void;
}

const Settings: React.FC<SettingsProps> = ({
  categories,
  onDeleteCategory,
  onImportBookmarks,
}) => {
  const { logout } = useAuth();
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleDeleteClick = (categoryId: string) => {
    setDeletingCategory(categoryId);
  };

  const confirmDelete = () => {
    if (deletingCategory) {
      onDeleteCategory(deletingCategory);
      setDeletingCategory(null);
    }
  };

  const cancelDelete = () => {
    setDeletingCategory(null);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Parse different browser export formats
      let bookmarksToImport: Partial<Bookmark>[] = [];

      // Helper function to recursively extract bookmarks from Firefox format
      const extractFirefoxBookmarks = (item: any): Partial<Bookmark>[] => {
        const results: Partial<Bookmark>[] = [];
        
        // If it's a bookmark (has uri/url)
        if (item.uri || item.url) {
          results.push({
            url: item.uri || item.url,
            title: item.title || item.name || item.uri || item.url || "",
            description: item.description || "",
            tags: item.tags || [],
            isFavorite: false,
            isArchived: false,
          });
        }
        
        // If it has children, recursively process them
        if (item.children && Array.isArray(item.children)) {
          item.children.forEach((child: any) => {
            results.push(...extractFirefoxBookmarks(child));
          });
        }
        
        return results;
      };

      // Chrome/Edge format (Netscape Bookmark File Format)
      if (typeof data === "string" || data.roots) {
        // Handle HTML bookmark file (Netscape format)
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const links = doc.querySelectorAll("a");

        bookmarksToImport = Array.from(links).map((link) => ({
          url: link.href,
          title: link.textContent || link.href,
          description: "",
          tags: [],
          isFavorite: false,
          isArchived: false,
        }));
      }
      // Firefox JSON format (nested structure with children)
      else if (data.guid && (data.children || data.root)) {
        bookmarksToImport = extractFirefoxBookmarks(data);
      }
      // Simple array format
      else if (Array.isArray(data)) {
        bookmarksToImport = data.flatMap((item) => extractFirefoxBookmarks(item));
      }
      // Generic JSON object format
      else if (data.bookmarks && Array.isArray(data.bookmarks)) {
        bookmarksToImport = data.bookmarks.map((item: any) => ({
          url: item.url || "",
          title: item.title || "",
          description: item.description || "",
          tags: item.tags || [],
          isFavorite: item.isFavorite || false,
          isArchived: item.isArchived || false,
        }));
      }

      // Filter out invalid bookmarks
      bookmarksToImport = bookmarksToImport.filter(
        (b) => b.url && b.url.startsWith("http"),
      );

      if (bookmarksToImport.length === 0) {
        setImportStatus({
          type: "error",
          message: "No valid bookmarks found in the file.",
        });
      } else {
        await onImportBookmarks(bookmarksToImport);
        setImportStatus({
          type: "success",
          message: `Successfully imported ${bookmarksToImport.length} bookmark${bookmarksToImport.length !== 1 ? "s" : ""}.`,
        });
      }
    } catch (error) {
      console.error("Import error:", error);
      setImportStatus({
        type: "error",
        message:
          "Failed to parse the file. Please ensure it's a valid bookmark export file.",
      });
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = "";
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your categories and preferences
          </p>
        </div>

        {/* Import Status Alert */}
        {importStatus && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              importStatus.type === "success"
                ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900"
                : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900"
            }`}
          >
            <div className="flex items-center gap-3">
              {importStatus.type === "success" ? (
                <CheckCircle
                  className="text-green-600 dark:text-green-400"
                  size={20}
                />
              ) : (
                <AlertCircle
                  className="text-red-600 dark:text-red-400"
                  size={20}
                />
              )}
              <p
                className={`text-sm ${
                  importStatus.type === "success"
                    ? "text-green-800 dark:text-green-200"
                    : "text-red-800 dark:text-red-200"
                }`}
              >
                {importStatus.message}
              </p>
              <button
                onClick={() => setImportStatus(null)}
                className="ml-auto text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Import Bookmarks Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold">Import Bookmarks</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Import bookmarks from your browser (Chrome, Firefox, Edge, Safari)
            </p>
          </div>

          <div className="p-6">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
              <FileJson className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="font-semibold mb-2">Upload Bookmark File</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Supports JSON or HTML bookmark export files from any browser
              </p>

              <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                <Upload size={20} />
                <span>{isImporting ? "Importing..." : "Choose File"}</span>
                <input
                  type="file"
                  accept=".json,.html,.htm"
                  onChange={handleFileUpload}
                  disabled={isImporting}
                  className="hidden"
                />
              </label>

              <p className="text-xs text-gray-400 mt-4">
                To export bookmarks from your browser:
                <br />
                <strong>Chrome/Edge:</strong> ⋮ → Bookmarks → Bookmark Manager →
                ⋮ → Export bookmarks
                <br />
                <strong>Firefox:</strong> ☰ → Bookmarks → Manage Bookmarks →
                Import and Backup → Export
              </p>
            </div>
          </div>
        </div>

        {/* Categories Management Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold">Manage Categories</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Delete categories you no longer need
            </p>
          </div>

          <div className="p-6">
            {categories.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen
                  className="mx-auto mb-4 text-gray-300 dark:text-gray-700"
                  size={48}
                />
                <p className="text-gray-500 dark:text-gray-400">
                  No categories yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FolderOpen size={20} style={{ color: category.color }} />
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {category.bookmarkCount || 0} bookmark
                          {category.bookmarkCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(category.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                    >
                      <Trash2 size={16} />
                      <span className="text-sm font-medium">Delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden mt-6">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold">Account</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your account settings
            </p>
          </div>

          <div className="p-6">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors w-full border border-red-200 dark:border-red-900"
            >
              <LogOut size={20} />
              <div className="flex-1 text-left">
                <p className="font-medium">Log Out</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sign out of your account
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Delete Category</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Are you sure you want to delete this category? This action
                  cannot be undone. Bookmarks in this category will become
                  uncategorized.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
