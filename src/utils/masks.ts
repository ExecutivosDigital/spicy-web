export function maskDigits(value: string) {
  if (!value) {
    return "";
  }
  value = value.replace(/\D/g, "");
  return value;
}

export function maskPhone(value: string) {
  if (!value) {
    return "";
  }
  value = value.replace(/\D/g, "");
  // (11)1111-1111
  value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
}

export function maskPhoneWithCountryCode(value: string) {
  if (!value) {
    return "";
  }
  value = value.replace(/\D/g, "");
  // +55 (99) 99933-9495
  value = `+${value.slice(0, 2)} (${value.slice(2, 4)}) ${value.slice(4, 9)}-${value.slice(9)}`;
  return value;
}

export function maskCurrency(value: string | number) {
  const stringValue = typeof value === "number" ? value.toString() : value;
  if (!stringValue) {
    return "";
  }
  const cleanedValue = stringValue.replace(/\D/g, "");
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(cleanedValue) / 100);
}

export function maskCpfCnpj(value: string) {
  if (!value) {
    return "";
  }
  value = value.replace(/\D/g, "");

  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");
  }

  return value;
}
