import { useMemo, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, MoreHorizontal, Trash2, Edit, Calendar, User, FileText, Grid3x3, List, Download } from "lucide-react"
import { toast } from "sonner"
import { FileIcon, defaultStyles, } from "react-file-icon"
import type { DefaultExtensionType } from "react-file-icon"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PageHeader, ConfirmDialog } from "@/components/custom"
import { DocumentPreview } from "@/components/custom/document/DocumentPreview"
import type { DocumentViewMode } from "@/features/documents/data"
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux"
import { fetchAllDocuments, deleteDocumentById } from "@/features/slices/documentSlice"
import type { DocumentResponse } from "@/types/document.types"

const DocumentListPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { documents, loading } = useAppSelector((state) => state.document)
  
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<DocumentViewMode>("grid")
  const [previewOpen, setPreviewOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<DocumentResponse | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchAllDocuments())
  }, [dispatch])

  const filteredDocuments = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return documents
    return documents.filter((document) => {
      const searchable = `${document.filename} ${document.fileType}`.toLowerCase()
      return searchable.includes(keyword)
    })
  }, [searchTerm, documents])

  const handlePreview = (document: DocumentResponse) => {
    setSelectedDocument(document)
    setPreviewOpen(true)
  }

  const handleUploadNavigate = () => {
    navigate("/admin/documents/upsert")
  }

  const handleEditNavigate = (document: DocumentResponse) => {
    navigate(`/admin/documents/upsert?docId=${document.id}`)
  }

  const handleDeleteClick = (documentId: string) => {
    setDocumentToDelete(documentId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return
    
    try {
      await dispatch(deleteDocumentById(documentToDelete)).unwrap()
      toast.success('Xóa tài liệu thành công')
      setDeleteDialogOpen(false)
      setDocumentToDelete(null)
    } catch (error) {
      console.error('Failed to delete document:', error)
      toast.error('Không thể xóa tài liệu')
    }
  }

  const handleDownload = (document: DocumentResponse) => {
    window.open(document.docUrl, '_blank')
  }

  const handleRefresh = () => {
    dispatch(fetchAllDocuments())
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const FileTypeIcon = ({ extension }: { extension: string }) => {
    const normalized = extension.toLowerCase()
    const DEFAULT_STYLE_KEYS = Object.keys(defaultStyles) as DefaultExtensionType[]
    const styleKey = DEFAULT_STYLE_KEYS.includes(normalized as DefaultExtensionType)
      ? (normalized as DefaultExtensionType)
      : "pdf"
    return (
      <div className="size-12 rounded-xl bg-muted/60 p-2">
        <FileIcon extension={normalized} {...defaultStyles[styleKey]} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý tài liệu"
        description="Xem và quản lý tất cả tài liệu trong hệ thống"
        onAdd={handleUploadNavigate}
        addButtonText="Tải lên tài liệu"
        onRefresh={handleRefresh}
        isLoading={loading}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm theo tên, chủ sở hữu hoặc định dạng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Danh sách tài liệu</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document) => (
                <Card 
                  key={document.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handlePreview(document)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <FileTypeIcon extension={document.fileType} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{document.filename}</h3>
                        {document.isEmbed && (
                          <Badge variant="secondary" className="text-xs mt-1">Indexed</Badge>
                        )}
                        {document.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {document.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <User className="h-3 w-3" />
                          <span>{document.createdBy || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(document.updatedAt)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatFileSize(document.size)}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handlePreview(document)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Xem trước
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(document)}>
                            <Download className="h-4 w-4 mr-2" />
                            Tải xuống
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditNavigate(document)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteClick(document.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDocuments.map((document) => (
                <Card 
                  key={document.id} 
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handlePreview(document)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="shrink-0">
                        <FileTypeIcon extension={document.fileType} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm truncate">{document.filename}</h3>
                          {document.isEmbed && (
                            <Badge variant="secondary" className="text-xs">Indexed</Badge>
                          )}
                        </div>
                        {document.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {document.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{document.createdBy || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(document.updatedAt)}</span>
                          </div>
                          <span>{formatFileSize(document.size)}</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handlePreview(document)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Xem trước
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(document)}>
                            <Download className="h-4 w-4 mr-2" />
                            Tải xuống
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditNavigate(document)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteClick(document.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {loading ? 'Đang tải tài liệu...' : 'Không tìm thấy tài liệu nào'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <DocumentPreview
        document={selectedDocument ? {
          id: selectedDocument.id,
          name: selectedDocument.filename,
          extension: selectedDocument.fileType,
          size: formatFileSize(selectedDocument.size),
          url: selectedDocument.docUrl,
          owner: selectedDocument.createdBy || 'Unknown',
          updatedAt: selectedDocument.updatedAt || new Date().toISOString(),
          mimeType: selectedDocument.fileType,
          starred: false,
          description: selectedDocument.description || '',
        } : null}
        open={previewOpen}
        onOpenChange={(open) => {
          setPreviewOpen(open)
          if (!open) {
            setSelectedDocument(null)
          }
        }}
        onEdit={() => {
          if (selectedDocument) {
            handleEditNavigate(selectedDocument)
          }
        }}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xác nhận xóa tài liệu"
        description="Bạn có chắc chắn muốn xóa tài liệu này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
      />
    </div>
  )
}

export default DocumentListPage