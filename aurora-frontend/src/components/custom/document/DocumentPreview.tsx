import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { CalendarDays, Download, PenSquare, User } from "lucide-react";
import { FileIcon, defaultStyles } from "react-file-icon";
import type { DefaultExtensionType } from "react-file-icon";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { DocumentItem } from "@/features/documents/data";

type DocumentPreviewProps = {
  document: DocumentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (document: DocumentItem) => void;
};

export const DocumentPreview = ({
  document,
  open,
  onOpenChange,
  onEdit,
}: DocumentPreviewProps) => {
  const canPreview =
    !!document && (document.extension.toLowerCase() === "pdf" || document.mimeType === "application/pdf");
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-xl p-0 flex flex-col">
        {document ? (
          <>
            <SheetHeader className="border-b bg-muted/50 shrink-0">
              <div className="flex flex-col gap-2 text-left">
                <SheetTitle>{document.name}</SheetTitle>
                <SheetDescription>
                  Cập nhật {formatUpdatedAt(document.updatedAt)} ·{" "}
                  {document.size}
                </SheetDescription>
                <Badge variant="secondary" className="w-fit uppercase">
                  {document.extension}
                </Badge>
              </div>
            </SheetHeader>

            <div className="bg-muted/40 px-4 py-3 shrink-0">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="size-4" />
                <span>Chủ sở hữu: </span>
                <span className="font-medium text-foreground">
                  {document.owner}
                </span>
              </div>
            </div>

            <ScrollArea className="flex-1 min-h-0">
              <div className="space-y-4 p-4 pb-24">
                <div className="rounded-xl border bg-white/90 p-3 shadow-inner">
                  {canPreview ? (
                    <div style={{ height: "420px" }}>
                      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        <Viewer
                          fileUrl={document.url}
                          plugins={[defaultLayoutPluginInstance]}
                        />
                      </Worker>
                    </div>
                  ) : (
                    <PreviewFallback extension={document.extension} />
                  )}
                </div>

                <div className="rounded-xl border bg-card p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Chi tiết tài liệu
                  </h3>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Loại tệp</dt>
                      <dd className="font-medium uppercase">
                        {document.mimeType}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Kích thước</dt>
                      <dd className="font-medium">{document.size}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Cập nhật</dt>
                      <dd className="flex items-center gap-2 font-medium">
                        <CalendarDays className="size-4 text-muted-foreground" />
                        {formatUpdatedAt(document.updatedAt)}
                      </dd>
                    </div>
                    {document.description && (
                      <div className="flex flex-col gap-1 pt-2 border-t">
                        <dt className="text-muted-foreground">Mô tả</dt>
                        <dd className="font-medium text-sm">
                          {document.description}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </ScrollArea>

            <SheetFooter className="border-t bg-white shrink-0 mt-auto">
              <div className="flex w-full flex-col gap-2 sm:flex-row">
                <Button
                  className="w-1/2 gap-2"
                  onClick={() => window.open(document.url, "_blank")}
                >
                  <Download className="size-4" />
                  Tải xuống
                </Button>
                <Button
                  variant="outline"
                  className="w-1/2 gap-2"
                  onClick={() => document && onEdit?.(document)}
                >
                  <PenSquare className="size-4" />
                  Chỉnh sửa
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex h-full items-center justify-center p-8 text-center text-sm text-muted-foreground">
            Chọn một tài liệu để xem chi tiết.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

const DEFAULT_STYLE_KEYS = Object.keys(defaultStyles) as DefaultExtensionType[];

const PreviewFallback = ({ extension }: { extension: string }) => {
  const normalized = extension.toLowerCase();
  const style =
    defaultStyles[
      DEFAULT_STYLE_KEYS.includes(normalized as DefaultExtensionType)
        ? (normalized as DefaultExtensionType)
        : (normalized === "pdf" || normalized === 'application/pdf')
        ? "pdf"
        : "docx"
    ];
  return (
    <div className="flex h-[420px] flex-col items-center justify-center gap-4 text-center text-muted-foreground">
      <div className="size-24 rounded-2xl border bg-muted/60 p-4">
        <FileIcon extension={normalized} {...style} />
      </div>
      <p>Không thể hiển thị bản xem trước cho loại tệp này.</p>
    </div>
  );
};

const formatUpdatedAt = (value: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value)
);
