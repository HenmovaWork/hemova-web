import React from "react";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const PhoneInput = ({ form }: { form: any }) => {
  return (
    <div className="flex space-x-2">
      <FormField
        control={form.control}
        name="phone.countryCode"
        render={({ field }) => (
          <FormItem className="w-[100px]">
            <FormLabel>Code</FormLabel>
            <FormControl>
              <Input {...field} placeholder="+91" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phone.number"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input {...field} placeholder="1234567890" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PhoneInput;
