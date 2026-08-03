import { useMutation, useQuery } from "@tanstack/react-query";
import { formsService } from "../services/formsService";

export const useContactMutation = () =>
  useMutation({ mutationFn: formsService.submitContact });

export const useEnquiryMutation = () =>
  useMutation({ mutationFn: formsService.submitEnquiry });

export const useSubscribeMutation = () =>
  useMutation({ mutationFn: formsService.subscribe });

export const useQrCode = () =>
  useQuery({
    queryKey: ["qr-code"],
    queryFn: formsService.getQrCode,
  });
