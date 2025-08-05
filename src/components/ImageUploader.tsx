'use client';

import React, { useState, useRef, useCallback } from 'react';
import NextImage from 'next/image';

interface ImageUploaderProps {
  onImageUpload: (imageData: string) => void;
  currentImage?: string;
  maxSize?: number; // MB
  aspectRatio?: number; // width/height
  maxWidth?: number;
  maxHeight?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  currentImage,
  maxSize = 5, // 5MB default
  aspectRatio,
  maxWidth = 800,
  maxHeight = 600,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const resizeImage = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = canvasRef.current;
      
      if (!canvas) {
        reject(new Error('Canvas não disponível'));
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Contexto do canvas não disponível'));
        return;
      }

      img.onload = () => {
        let { width, height } = img;

        // Calcular novas dimensões mantendo proporção
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        // Aplicar aspect ratio se especificado
        if (aspectRatio) {
          const currentRatio = width / height;
          if (currentRatio > aspectRatio) {
            width = height * aspectRatio;
          } else {
            height = width / aspectRatio;
          }
        }

        // Redimensionar canvas e desenhar imagem
        canvas.width = width;
        canvas.height = height;

        // Aplicar suavização
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0, width, height);

        // Converter para base64 com qualidade otimizada
        const quality = file.size > 1024 * 1024 ? 0.8 : 0.9; // Menor qualidade para arquivos grandes
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = URL.createObjectURL(file);
    });
  }, [maxWidth, maxHeight, aspectRatio]);

  const validateFile = (file: File): string | null => {
    // Verificar tipo
    if (!file.type.startsWith('image/')) {
      return 'Arquivo deve ser uma imagem';
    }

    // Verificar tamanho
    if (file.size > maxSize * 1024 * 1024) {
      return `Arquivo deve ter no máximo ${maxSize}MB`;
    }

    // Verificar formatos suportados
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!supportedTypes.includes(file.type)) {
      return 'Formato suportado: JPG, PNG, WebP';
    }

    return null;
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    setUploading(true);

    try {
      // Validar arquivo
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Redimensionar e otimizar
      const resizedImageData = await resizeImage(file);
      
      // Atualizar preview
      setPreview(resizedImageData);
      
      // Callback com dados da imagem
      onImageUpload(resizedImageData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar imagem');
    } finally {
      setUploading(false);
    }
  }, [onImageUpload, validateFile, resizeImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setError(null);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Canvas oculto para redimensionamento */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Área de upload */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-sm text-gray-600">Processando imagem...</p>
          </div>
        ) : preview ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <NextImage
                src={preview}
                alt="Preview"
                width={128}
                height={128}
                className="max-w-full h-32 object-cover rounded-lg border"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-green-600">✓ Imagem carregada com sucesso</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-gray-400 text-4xl">📷</div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Arraste uma imagem aqui ou{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-500 hover:text-blue-600"
                >
                  clique para selecionar
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG, WebP até {maxSize}MB
                {aspectRatio && (
                  <span> • Proporção {aspectRatio.toFixed(2)}:1</span>
                )}
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">⚠️ {error}</p>
        </div>
      )}

      {/* Informações adicionais */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-800 mb-1">💡 Dicas:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• A imagem será redimensionada automaticamente para {maxWidth}x{maxHeight}px</li>
          <li>• Use imagens de alta qualidade para melhor resultado</li>
          <li>• Formatos recomendados: JPG para fotos, PNG para logos</li>
          {aspectRatio && (
            <li>• A proporção será ajustada para {aspectRatio.toFixed(2)}:1</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ImageUploader;
