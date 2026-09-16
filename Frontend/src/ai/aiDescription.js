import { axiosInstance } from "../utils/axios";

export const getAiDescription = async (values) => {
  const { data } = await axiosInstance.post(
    "/v1/rent/user/generateDescription",
    {
      propertyName: values.name,
      extraInfo: values.extraInfo,
      propertyType: values.propertyType,
      roomType: values.roomType,
      maximumGuest: values.maximumGuest,
      amenities: values.amenities,
      price: values.price,
      address: values.address,
    }
  );

  return data.data.description;
};
