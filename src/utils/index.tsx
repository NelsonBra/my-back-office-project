import { PaymentMethod, PaymentStatus } from "@/enum";

export const getPaymentStatusLabel = (status: PaymentStatus): string => {
  switch (status) {
    case PaymentStatus.Paid:
      return "Pago";
    case PaymentStatus.Pending:
      return "Pendente";
    default:
      return "Unknown";
  }
};

export const getPaymentMethodLabel = (method: PaymentMethod): string => {
  switch (method) {
    case PaymentMethod.Multibanco:
      return "Multibanco";
    case PaymentMethod.Transferencia:
      return "Transferência";
    default:
      return "desconhecido";
  }
};
