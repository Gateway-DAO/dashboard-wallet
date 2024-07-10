import { CryptoService } from '@/services/crypto/crypto';
import { PrivateDataAsset } from '@/services/protocol-v3/types';
import { PartialDeep } from 'type-fest';

import { getClaimObject } from './data-model';

export enum FileType {
  pda,
  image,
  video,
  audio,
  document,
  pdf,
  other,
}

export const getFileTypeByMimeType = (mimeType: string) => {
  if (mimeType.includes('audio')) {
    return FileType.audio;
  } else if (mimeType.includes('image')) {
    return FileType.image;
  } else if (mimeType.includes('video')) {
    return FileType.video;
  } else if (mimeType.includes('pdf')) {
    return FileType.pdf;
  } else if (mimeType.includes('document') || mimeType.includes('doc')) {
    return FileType.document;
  } else {
    return FileType.other;
  }
};

export const getFileTypeByPda = (pda: PrivateDataAsset) => {
  if (pda.structured || !pda.mimeType) {
    return FileType.pda;
  }

  const { mimeType } = pda;

  return getFileTypeByMimeType(mimeType);
};

export const getIconFile = (file: FileType) => {
  switch (file) {
    case FileType.audio:
      return '/images/data_file_generic.svg';
    case FileType.document:
      return '/images/data_file_document.svg';
    case FileType.pdf:
      return '/images/data_file_pdf.svg';
    case FileType.image:
      return '/images/data_file_image.svg';
    case FileType.pda:
      return '/images/data_asset.svg';
    case FileType.video:
      return '/images/data_file_video.svg';
    case FileType.other:
    default:
      return '/images/data_file_generic.svg';
  }
};

export const getBgColorIconFile = (file: FileType) => {
  switch (file) {
    case FileType.pdf:
    case FileType.image:
    case FileType.video:
      return '#E5393516';
    case FileType.document:
    case FileType.audio:
    case FileType.other:
    default:
      return '#1E88E516';
  }
};

const translatedPDAFields: Record<string, string> = {
  lastUpdated: 'updatedAt',
} satisfies Partial<Record<keyof PrivateDataAsset, string>>;

export const translatePDAFieldToColumnName = (field: string) => {
  return translatedPDAFields[field] || field;
};

export async function decryptPda(
  pda: PartialDeep<PrivateDataAsset>,
  pemKey: string
) {
  try {
    let jsonData: Record<string, any> = {};

    if (!pda.structured) {
      jsonData = {
        title: pda.fileName,
        description: 'File description',
      };
    } else {
      const decryptedString = await CryptoService.decryptEncryptedJson(
        pda.cipher,
        pemKey
      );
      jsonData = JSON.parse(decryptedString);
    }

    let newClaim = {};

    if (pda.structured) {
      const claim = jsonData['claim'];
      const schemaProperties =
        pda.dataModel != null ? pda.dataModel!.schema['properties'] : null;
      newClaim =
        schemaProperties != null
          ? getClaimObject(schemaProperties, claim)
          : claim;
    }

    return {
      ...pda,
      dataAsset: {
        description: jsonData['description']!,
        title: jsonData['title'],
        claim: newClaim,
      },
    };
  } catch (e) {
    console.error(e, pda);
    throw e;
  }
}
