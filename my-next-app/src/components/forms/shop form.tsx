'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import Image from "next/image";
import { useRouter } from 'next/navigation';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import * as z from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@/components/ui/table';
import { useToast } from '../ui/use-toast';

import { createShop } from "@/app/utils/Api";

const shopSchema = z.object({
  areaCode: z.number().min(1, { message: 'Area Code is required' }),
  areaName: z.string().min(1, { message: 'Area Name is required' }),
  partyCode: z.number().min(1, { message: 'Party Code is required' }),
  party: z.string().min(1, { message: 'Party is required' }),
  subAreaCode: z.number().min(1, { message: 'Sub Area Code is required' }),
  subAreaName: z.string().min(1, { message: 'Sub Area Name is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  contactPerson: z.string().min(1, { message: 'Contact Person is required' }),
  phone: z.string().min(1, { message: 'Phone is required' }),
  mobile: z.string().min(1, { message: 'Mobile is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  ntn: z.string().min(1, { message: 'NTN is required' }),
  filer: z.boolean().optional(),
  cnicNumber: z.string().min(1, { message: 'CNIC Number is required' }),
  cnicPerson: z.string().min(1, { message: 'CNIC Person is required' }),
  latitude: z.string().min(1, { message: 'Latitude is required' }),
  longitude: z.string().min(1, { message: 'Longitude is required' }),
});

type ShopFormValues = z.infer<typeof shopSchema>;

interface ShopFormProps {
  initialData: ShopFormValues | null;
}

export const ShopForm: React.FC<ShopFormProps> = ({ initialData }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const title = initialData ? 'Edit Shop' : 'Create Shop';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues: ShopFormValues = initialData || {
    areaCode: 0,
    areaName: "",
    partyCode: 0,
    party: "",
    subAreaCode: 0,
    subAreaName: "",
    category: "",
    contactPerson: "",
    phone: "",
    mobile: "",
    address: "",
    ntn: "",
    filer: true,
    cnicNumber: "",
    cnicPerson: "",
    latitude: "",
    longitude: "",
  };

  const form = useForm<ShopFormValues>({
    resolver: zodResolver(shopSchema),
    defaultValues
  });

  const onSubmit = async (data: ShopFormValues) => {
    console.log("Hi into submit");
    const token = localStorage.getItem("token") || "";

    const shopData = {
      areaCode: data.areaCode,
      areaName: data.areaName,
      partyCode: data.partyCode,
      party: data.party,
      subAreaCode: data.subAreaCode,
      subAreaName: data.subAreaName,
      category: data.category,
      contactPerson: data.contactPerson,
      phone: data.phone,
      mobile: data.mobile,
      address: data.address,
      ntn: data.ntn,
      filer: data.filer || false,
      cnicNumber: data.cnicNumber,
      cnicPerson: data.cnicPerson,
      latitude: data.latitude,
      longitude: data.longitude,
    };

    try {
      setLoading(true);
      await createShop(shopData, token);
      toast({
        title: 'Shop created.',
        description: 'Shop has been successfully created.',
      });
      router.push('/dashboard/shop');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `There was an error creating the shop.${error}`,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
    <div className="flex justify-end space-x-4">
    <Button
      className="bg-black text-white hover:bg-gray-600"
      type="button"
  onClick={() => router.push('/dashboard/employee')}
    >
      Discard
    </Button>
     <Button
      className="bg-white-500 text-black hover:bg-gray-300"
      disabled={loading}
      type="submit"
      form="shopForm"
    >
      {action}
    </Button>
  </div>
        <div className="flex items-center justify-between">
          <Heading title={title} description="Provide employee details below." />
          {initialData && (
            <Button
              disabled={loading}
              variant="destructive"
              size="sm"
              onClick={() => setOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Separator />
      <Separator />
  
      <Form {...form}>
        <form id="shopForm" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 lg:gap-8">
            {/* Column 1: Shop Details and Filer Status */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shop Details</CardTitle>
                  <CardDescription>Provide the basic information about the shop.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FormItem>
                      <FormLabel htmlFor="areaCode">Area Code</FormLabel>
                      <FormControl>
                        <Input id="areaCode" type="number" {...form.register("areaCode", { valueAsNumber: true })} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.areaCode?.message}</FormMessage>
                    </FormItem>
                    <FormItem>
                      <FormLabel htmlFor="areaName">Area Name</FormLabel>
                      <FormControl>
                        <Input id="areaName" type="text" {...form.register('areaName')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem>
                      <FormLabel htmlFor="partyCode">Party Code</FormLabel>
                      <FormControl>
                        <Input id="partyCode" type="number" {...form.register('partyCode', { valueAsNumber: true })} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem>
                      <FormLabel htmlFor="party">Party</FormLabel>
                      <FormControl>
                        <Input id="party" type="text" {...form.register('party')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem>
                      <FormLabel htmlFor="subAreaCode">Sub Area Code</FormLabel>
                      <FormControl>
                        <Input id="subAreaCode" type="number" {...form.register('subAreaCode', { valueAsNumber: true })} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem>
                      <FormLabel htmlFor="subAreaName">Sub Area Name</FormLabel>
                      <FormControl>
                        <Input id="subAreaName" type="text" {...form.register('subAreaName')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem>
                      <FormLabel htmlFor="category">Category</FormLabel>
                      <FormControl>
                        <Input id="category" type="text" {...form.register('category')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                </CardContent>
              </Card>
              <Card style={{ height: '13.5rem' }}>
                <CardHeader>
                  <CardTitle>Filer Status</CardTitle>
                  <CardDescription>Indicate if the shop is a filer or non-filer.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormItem>
                    <FormLabel htmlFor="filer">Filer Status</FormLabel>
                    <FormControl>
                      <Select {...form.register("filer")} defaultValue="true">
                        <SelectTrigger aria-label="Select filer status">
                          <SelectValue placeholder="Select filer status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Filer</SelectItem>
                          <SelectItem value="false">Non-filer</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </CardContent>
              </Card>
              </div>
  
            {/* Column 2: Contact Information and Location Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FormItem>
                      <FormLabel htmlFor="contactPerson">Contact Person</FormLabel>
                      <FormControl>
                        <Input id="contactPerson" type="text" {...form.register('contactPerson')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem>
                      <FormLabel htmlFor="phone">Phone</FormLabel>
                      <FormControl>
                        <Input id="phone" type="text" {...form.register('phone')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem>
                      <FormLabel htmlFor="mobile">Mobile</FormLabel>
                      <FormControl>
                        <Input id="mobile" type="text" {...form.register('mobile')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem>
                      <FormLabel htmlFor="address">Address</FormLabel>
                      <FormControl>
                        <Input id="address" type="text" {...form.register('address')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem>
                      <FormLabel htmlFor="ntn">NTN</FormLabel>
                      <FormControl>
                        <Input id="ntn" type="text" {...form.register('ntn')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem>
                      <FormLabel htmlFor="cnicNumber">CNIC Number</FormLabel>
                      <FormControl>
                        <Input id="cnicNumber" type="text" {...form.register('cnicNumber')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem>
                      <FormLabel htmlFor="cnicPerson">CNIC Person</FormLabel>
                      <FormControl>
                        <Input id="cnicPerson" type="text" {...form.register('cnicPerson')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                </CardContent>
              </Card>
  
              <Card>
                <CardHeader>
                  <CardTitle>Location Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FormItem>
                      <FormLabel htmlFor="latitude">Latitude</FormLabel>
                      <FormControl>
                        <Input id="latitude" type="text" {...form.register('latitude')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem>
                      <FormLabel htmlFor="longitude">Longitude</FormLabel>
                      <FormControl>
                        <Input id="longitude" type="text" {...form.register('longitude')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
  
          {/* Form Actions */}
          {/* <div className="flex justify-end space-x-4 mt-8">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" variant="secondary" className="w-full">
              {action}
            </Button>
          </div> */}
        </form>
      </Form>
   
    </>
  );
  
  
  
  
};

