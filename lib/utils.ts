import { CSSProperties } from "react";
import { ReadonlyURLSearchParams } from "next/navigation";

import { Column } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Atom, Braces, File } from "lucide-react";
import { twMerge } from "tailwind-merge";

import { TIME_IN_SECONDS } from "./constant";
import { isNil } from "lodash";
import BigNumber from "bignumber.js";

dayjs.extend(duration);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toTimeFormat = (seconds: number, format?: string) => {
  const duration = dayjs.duration(seconds, "seconds");
  let formatTime = "";
  if (seconds >= TIME_IN_SECONDS.ONE_DAY) {
    formatTime = "DD:HH";
  } else if (seconds >= TIME_IN_SECONDS.ONE_HOUR) {
    formatTime = "H[h]:m[m]";
  } else {
    formatTime = "mm:ss";
  }

  return duration.format(format ?? formatTime);
};

export const getCommonPinningStyles = (column: Column<any>): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  return {
    transition: "filter .25s ease",
    filter: isLastLeftPinnedColumn
      ? "-4px 0 4px -4px gray inset"
      : isFirstRightPinnedColumn
      ? "drop-shadow(0px -24px 20px rgba(0, 0, 0, 0.25))"
      : undefined,
    left: isPinned === "left" ? `${column.getStart("left") - 1}px` : undefined,
    right:
      isPinned === "right"
        ? `${column.getAfter("right") - (isFirstRightPinnedColumn ? 2 : 0)}px`
        : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};

export const optionFromEnum = (enumInput: object) => {
  return Object.entries(enumInput).map(([key, value]) => {
    return {
      label: key,
      value,
    };
  });
};

export const generatePageNumbers = (page: number, totalPage: number) => {
  if (totalPage > 5) {
    if (page < 3 || page > totalPage - 2) {
      return [1, 2, "...", totalPage - 1, totalPage];
    } else {
      return [1, "...", page - 1, page, page + 1, "...", totalPage];
    }
  } else {
    return Array.from({ length: totalPage }, (_, i) => i + 1);
  }
};

export const createQueryString = (
  searchParams: ReadonlyURLSearchParams,
  queries: { name: string; value: string }[]
) => {
  const params = new URLSearchParams(searchParams.toString());
  queries.forEach((query) => {
    params.set(query.name, query.value);
  });

  return params.toString();
};

export const fileIcon = (fileName: string) => {
  const fileType = fileName.split(".").pop();

  if (fileType === "tsx" || fileType === "jsx") return Atom;

  if (fileType === "json") return Braces;

  return File;
};

export const extractMessage = (message: string) => {
  const regex = /^\[Message\] from .+? to .+?: ([\s\S]+)$/;
  const match = message.match(regex);

  if (match) {
    return match[1];
  }

  return "";
};
export function decodeJwtPayload(
  token: string
): { exp?: number; iat?: number; [key: string]: any } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decodedPayload = atob(paddedPayload);

    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
}

export const queryStringify = (obj?: { [key: string]: any }) => {
  const str = [];
  for (const p in obj)
    if (obj.hasOwnProperty(p) && !isNil(obj[p])) {
      str.push(
        encodeURIComponent(p) + "=" + encodeURIComponent(String(obj[p]))
      );
    }
  return str.join("&");
};

export const trimTrailingZeros = (str: string) => {
  return str.replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, "");
};

export const numberToVietnameseText = (
  num: string | number | BigNumber
): string => {
  const ones = [
    "",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const tens = [
    "",
    "",
    "hai mươi",
    "ba mươi",
    "bốn mươi",
    "năm mươi",
    "sáu mươi",
    "bảy mươi",
    "tám mươi",
    "chín mươi",
  ];
  const baseScales = ["", "nghìn", "triệu", "tỷ"]; // cycle of 3

  const bn = new BigNumber(num);

  if (bn.isZero()) return "không đồng";

  const convertHundreds = (n: number): string => {
    let result = "";
    const hundred = Math.floor(n / 100);
    const remainder = n % 100;
    const ten = Math.floor(remainder / 10);
    const one = remainder % 10;

    if (hundred > 0) {
      result += ones[hundred] + " trăm";
      if (remainder > 0) result += " ";
    }

    if (ten >= 2) {
      result += tens[ten];
      if (one > 0) {
        result += " " + (one === 1 ? "mốt" : one === 5 ? "lăm" : ones[one]);
      }
    } else if (ten === 1) {
      result += "mười";
      if (one > 0) {
        result += " " + (one === 5 ? "lăm" : ones[one]);
      }
    } else if (one > 0 && hundred > 0) {
      result += "lẻ " + (one === 5 ? "năm" : ones[one]);
    } else if (one > 0) {
      result += ones[one];
    }

    return result;
  };

  const getScale = (index: number): string => {
    if (index < baseScales.length) return baseScales[index];
    const base = Math.floor(index / 3);
    const remainder = index % 3;
    let suffix = "";
    for (let i = 0; i < base; i++) suffix += "tỷ ";
    return (baseScales[remainder] + " " + suffix).trim();
  };

  const convertBigNumber = (n: BigNumber): string => {
    let result = "";
    let scaleIndex = 0;
    let current = n;

    while (!current.isZero()) {
      const group = current.mod(1000).toNumber(); // always <1000 → safe as Number
      if (group > 0) {
        const groupText = convertHundreds(group);
        const scaleText = getScale(scaleIndex);
        result =
          groupText +
          (scaleText ? " " + scaleText : "") +
          (result ? " " + result : "");
      }
      current = current.dividedToIntegerBy(1000);
      scaleIndex++;
    }

    return result;
  };

  return convertBigNumber(bn) + " đồng";
};

export const formatFullName = (name: string) => {
  if (!name) return "";

  const nameSplit = name.split(" ");

  let result = "";
  nameSplit.forEach((elm, index) => {
    if (index < nameSplit.length - 1) {
      result += `${elm?.[0].toUpperCase()}.`;
    } else {
      result += elm;
    }
  });

  return result;
};

export const formatCurrency = (value: number | string) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value));
};
