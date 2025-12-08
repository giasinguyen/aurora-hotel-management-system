
import React, { useState, useCallback, useRef, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Viewer, Worker } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import { Upload, FileText, Eye, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/custom"
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux"
import { fetchDocumentById, uploadNewDocument, updateExistingDocument, updateDocumentMetadataOnly, clearCurrentDocument } from "@/features/slices/documentSlice"

const ACCEPTED_EXTENSIONS = [
  "pdf",
]

const ACCEPT_ATTRIBUTE = ACCEPTED_EXTENSIONS.map((ext) => `.${ext}`).join(",")

type MetadataState = {
  title: string
  owner: string
  description: string
}

const DEFAULT_METADATA: MetadataState = {
  title: "",
  owner: "Admin User", // Mặc định là người dùng hiện tại
  description: "",
}

type FileInfo = {
  file: File
  name: string
  size: string
  type: string
  url: string
}

export default function DocumentUpsertPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const docId = searchParams.get("docId")
  const isEditing = Boolean(docId)
  
  const { currentDocument, loading, uploadProgress } = useAppSelector((state) => state.document)
  
  const [metadata, setMetadata] = useState<MetadataState>(DEFAULT_METADATA)
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [shouldEmbed, setShouldEmbed] = useState(false)
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoadingBlob, setIsLoadingBlob] = useState(false);

  // Load existing document data when editing
  useEffect(() => {
    if (isEditing && docId) {
      dispatch(fetchDocumentById(docId))
    }
    
    return () => {
      dispatch(clearCurrentDocument())
    }
  }, [isEditing, docId, dispatch])

  // Populate form when document is loaded
  useEffect(() => {
    if (currentDocument) {
      setMetadata({
        title: currentDocument.filename.replace(/\.[^/.]+$/, ""),
        owner: currentDocument.createdBy || "Unknown",
        description: currentDocument.description || "",
      })
      setShouldEmbed(currentDocument.isEmbed)
      // For editing, show existing document preview
      setFileInfo({
        file: new File([], currentDocument.filename),
        name: currentDocument.filename,
        size: formatFileSize(currentDocument.size),
        type: currentDocument.fileType, // This is mimeType like "application/pdf"
        url: currentDocument.docUrl,
      })
    }
  }, [currentDocument])

  // Convert remote URL to blob for preview
  useEffect(() => {
    if (
      fileInfo?.url &&
      !fileInfo.url.startsWith("blob:") &&
      (fileInfo.type === "pdf" || fileInfo.type === "application/pdf")
    ) {
      console.log("Fetching document from URL:", fileInfo.url);
      setIsLoadingBlob(true);
      let currentBlobUrl: string | null = null;

      fetch(fileInfo.url)
        .then((res) => {
          console.log("Fetch response status:", res.status);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.arrayBuffer();
        })
        .then((arrayBuffer) => {
          console.log("ArrayBuffer size:", arrayBuffer.byteLength);
          const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
          currentBlobUrl = URL.createObjectURL(blob);
          console.log("Created blob URL:", currentBlobUrl);
          setBlobUrl(currentBlobUrl);
        })
        .catch((error) => {
          console.error("Failed to load PDF:", error);
          // Fallback: try to use the original URL directly
          setBlobUrl(fileInfo.url);
        })
        .finally(() => {
          setIsLoadingBlob(false);
        });

      return () => {
        if (currentBlobUrl && currentBlobUrl.startsWith('blob:')) {
          URL.revokeObjectURL(currentBlobUrl);
        }
      };
    } else if (fileInfo?.url?.startsWith("blob:")) {
      // Already a blob URL from file upload
      console.log("Using existing blob URL:", fileInfo.url);
      setBlobUrl(fileInfo.url);
    }
  }, [fileInfo?.url, fileInfo?.type])
  
  const [isDragOver, setIsDragOver] = useState(false)
  const [isFileLoading, setIsFileLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toLowerCase() || ""
  }

  const isFileSupported = useCallback((filename: string): boolean => {
    const extension = getFileExtension(filename)
    return ACCEPTED_EXTENSIONS.includes(extension)
  }, [])

  const handleFileSelect = useCallback(async (file: File) => {
    if (!isFileSupported(file.name)) {
      alert(`Định dạng file không được hỗ trợ. Chỉ chấp nhận: ${ACCEPTED_EXTENSIONS.join(", ")}`)
      return
    }

    setIsFileLoading(true)
    try {
      const url = URL.createObjectURL(file)
      const newFileInfo: FileInfo = {
        file,
        name: file.name,
        size: formatFileSize(file.size),
        type: getFileExtension(file.name),
        url,
      }

      setFileInfo(newFileInfo)
      
      // Auto-fill title from filename if empty
      setMetadata(prev => {
        if (!prev.title) {
          const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "")
          return { ...prev, title: nameWithoutExtension }
        }
        return prev
      })
    } catch (error) {
      console.error('Error reading file:', error)
      alert('Không thể đọc file. Vui lòng thử lại với file khác.')
    } finally {
      setIsFileLoading(false)
    }
  }, [isFileSupported])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleClearFile = () => {
    if (fileInfo?.url) {
      URL.revokeObjectURL(fileInfo.url)
    }
    setFileInfo(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleMetadataChange = (field: keyof MetadataState, value: string) => {
    setMetadata(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!fileInfo && !isEditing) {
      toast.error("Vui lòng chọn file để tải lên")
      return
    }

    if (!metadata.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề tài liệu")
      return
    }

    try {
      if (isEditing && docId) {
        // If editing and no new file selected, just update metadata
        if (!fileInfo?.file?.size) {
          await dispatch(updateDocumentMetadataOnly({ 
            id: docId, 
            description: metadata.description,
            shouldEmbed 
          })).unwrap()
          toast.success('Cập nhật thông tin tài liệu thành công!')
        } else {
          // If new file is selected, update with file
          await dispatch(updateExistingDocument({ 
            id: docId, 
            file: fileInfo.file, 
            shouldEmbed,
            description: metadata.description 
          })).unwrap()
          toast.success('Cập nhật tài liệu thành công!')
        }
      } else {
        // Creating new document
        if (!fileInfo?.file?.size) {
          toast.error("File không hợp lệ")
          return
        }
        await dispatch(uploadNewDocument({ 
          file: fileInfo.file, 
          shouldEmbed,
          description: metadata.description 
        })).unwrap()
        toast.success('Tải lên tài liệu thành công!')
      }
      navigate("/admin/documents")
    } catch (error) {
      console.error('Failed to save document:', error)
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!")
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin/documents")}
          className="mb-2"
        >
          ← Quay lại
        </Button>
        <PageHeader
          title={isEditing ? "Chỉnh sửa tài liệu" : "Thêm tài liệu mới"}
          description={
            isEditing
              ? "Cập nhật thông tin tài liệu"
              : "Tải lên và quản lý tài liệu mới"
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - File Upload & Metadata */}
        <div className="space-y-6">
          {/* File Upload Area */}
          {!fileInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-medium">
                  <Upload className="h-5 w-5" />
                  Tải lên tài liệu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    isDragOver
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">
                    Kéo thả file vào đây hoặc click để chọn
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Hỗ trợ các định dạng:{" "}
                    {ACCEPTED_EXTENSIONS.join(", ").toUpperCase()}
                  </p>
                  <Button variant="outline">Chọn file</Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPT_ATTRIBUTE}
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* File Info */}
          {fileInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Thông tin file
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFile}
                    className="flex items-center gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Xóa file
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Tên file:</span>
                  <span className="text-sm">{fileInfo.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Dung lượng:</span>
                  <span className="text-sm">{fileInfo.size}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Định dạng:</span>
                  <Badge variant="secondary">
                    {fileInfo.type === "application/pdf" ? "PDF" : fileInfo.type.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Thông tin tài liệu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Tiêu đề <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={metadata.title}
                  onChange={(e) =>
                    handleMetadataChange("title", e.target.value)
                  }
                  placeholder="Nhập tiêu đề tài liệu"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner">Người gửi</Label>
                <Input
                  id="owner"
                  value={metadata.owner}
                  onChange={(e) =>
                    handleMetadataChange("owner", e.target.value)
                  }
                  placeholder="Tên người gửi"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={metadata.description}
                  onChange={(e) =>
                    handleMetadataChange("description", e.target.value)
                  }
                  placeholder="Nhập mô tả chi tiết về tài liệu"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="shouldEmbed"
                  checked={shouldEmbed}
                  onChange={(e) => setShouldEmbed(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="shouldEmbed" className="cursor-pointer">
                  Lập chỉ mục cho RAG (Tìm kiếm ngữ nghĩa)
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1"
            >
              {loading
                ? uploadProgress > 0
                  ? `Đang tải lên... ${uploadProgress}%`
                  : "Đang xử lý..."
                : isEditing
                ? "Cập nhật tài liệu"
                : "Tải lên tài liệu"}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/documents")}
              disabled={loading}
            >
              Hủy
            </Button>
          </div>
        </div>

        {/* Right Column - Document Preview */}
        <div className="space-y-6">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
                <Eye className="h-5 w-5" />
                Xem trước tài liệu
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!fileInfo ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">
                    Chọn file để xem trước nội dung tài liệu
                  </p>
                </div>
              ) : (
                <div
                  className="border rounded-lg overflow-hidden"
                  style={{ height: "600px" }}
                >
                  {isFileLoading || isLoadingBlob ? (
                    <div className="flex h-full items-center justify-center p-8">
                      <div className="space-y-4 text-center">
                        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-sm text-gray-500">
                          {isLoadingBlob
                            ? "Đang tải tài liệu..."
                            : "Đang xử lý file..."}
                        </p>
                      </div>
                    </div>
                  ) : blobUrl ? (
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                      <Viewer
                        fileUrl={blobUrl}
                        plugins={[defaultLayoutPluginInstance]}
                      />
                    </Worker>
                  ) : (
                    <div className="flex h-full items-center justify-center p-8 text-center">
                      <div className="space-y-4">
                        <FileText className="h-16 w-16 mx-auto text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {fileInfo?.name}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Chỉ hỗ trợ xem trước file PDF
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            File sẽ được tải lên và có thể xem sau khi lưu
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
  }
