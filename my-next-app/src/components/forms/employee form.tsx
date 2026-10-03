'use client';

import { PlusCircle } from "lucide-react"


import {
  Card,
  CardContent,
  CardDescription,
CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import Image from "next/image";
import { Upload, Trash } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import * as z from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '../ui/use-toast';
import FileUpload from '../file-upload';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createEmployee } from "@/app/utils/Api";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export const IMG_MAX_LIMIT = 3;

const formSchema = z.object({
  name: z.string().min(3, { message: 'Employee Name must be at least 3 characters' }),
  lastName: z.string().min(3, { message: "Last name must be at least 3 chars" }),
  cnic: z.string().min(13, { message: 'CNIC must be at least 13 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  address: z.string().optional(),
  city: z.string().min(1, { message: 'City is required' }),
  area: z.string().optional(),
  phone1: z.string().min(11, { message: 'Phone number must be at least 11 characters' }),
  phone2: z.string().optional(),
  imei: z.string().optional(),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  CnicIssueDate: z.date({ required_error: 'CNIC issue date is required' }),
  CnicExpiryDate: z.date({ required_error: 'CNIC expiry date is required' }),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: any | null;
  categories: any;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, categories }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const title = initialData ? 'Edit Employee' : 'Create Employee';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData
    ? initialData
    : {
        name: '',
        lastName: '',
        cnic: '',
        email: '',
        address: '',
        city: '',
        area: '',
        phone1: '',
        phone2: '',
        imei: '',
        password: '',
        CnicIssueDate: new Date(),
        CnicExpiryDate: new Date(),
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProductFormValues) => {
    const token = localStorage.getItem("token") || "";
    console.log("token is ", token);
  
    const userData = {
      FirstName: data.name.split(' ')[0],
      LastName: data.lastName,
      CnicNumber: data.cnic,
      CnicIssueDate: format(data.CnicIssueDate, "yyyy-MM-dd"),
      CnicExpiryDate: format(data.CnicExpiryDate, "yyyy-MM-dd"),
      Email: data.email,
      Address: data.address || '',
      City: data.city,
      Area: data.area || '',
      Phone1: data.phone1,
      Phone2: data.phone2 || null,
      Imei: data.imei || null,
      password: data.password
    };
  
    try {
      setLoading(true);
      console.log(userData);
      const result = await createEmployee(userData, token);
      console.log('Employee created:', result);
      router.push(`/dashboard/employee`);
      toast({
        title: 'Employee created.',
        description: 'Employee has been successfully created.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const [cnicDate, setDate] = useState<Date>();
  const [cnicExpDate, setcnicExpDate] = useState<Date>();
  const [joinDate, setjoinDate] = useState<Date>();
  const [leftDate, setleftDate] = useState<Date>();

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
    form="employeeForm"
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
      <Form {...form}>
     <form
               id="employeeForm"
  onSubmit={form.handleSubmit(onSubmit)}
  className="w-full space-y-8"
>
<div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
  <Card x-chunk="dashboard-07-chunk-0">
    <CardHeader>
      <CardTitle>Employee Details</CardTitle>
      <CardDescription>
        Please provide the employee's details below.
      </CardDescription>
    </CardHeader>
    <CardContent>
  <div className="grid gap-6">
    <div className="grid gap-3">
      <Label htmlFor="firstName">First Name</Label>
      <Input
        id="firstName"
        type="text"
        className="w-full"
        {...form.register('name')} 
      />
    </div>
    <div className="grid gap-3">
      <Label htmlFor="lastName">Last Name</Label>
      <Input
        id="lastName"
        type="text"
        className="w-full"
        {...form.register('lastName')}
      />
    </div>
    <div className="grid gap-3">
      <Label htmlFor="cnic">CNIC NUMBER</Label>
      <Input
        id="cnic"
        type="text"
        className="w-full"
        {...form.register('cnic')}
      />
    </div>
    <div className="grid gap-3">
      <Label htmlFor="cnicIssueDate">CNIC ISSUE DATE</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !cnicDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {cnicDate ? format(cnicDate, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={cnicDate}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
    <div className="grid gap-3">
      <Label htmlFor="cnicExpiryDate">CNIC EXPIRY DATE</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !cnicExpDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {cnicExpDate ? format(cnicExpDate, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={cnicExpDate}
            onSelect={setcnicExpDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
{/*     <div className="grid gap-3">
      <Label htmlFor="email">Email Address</Label>
      <Input
        id="email"
        type="email"
        className="w-full"
        {...form.register('email')}
      />
    </div> */}
                {/*     <div className="grid gap-3">
      <Label htmlFor="address">Address</Label>
      <Input
        id="address"
        type="text"
        className="w-full"
        {...form.register('address')}
      />
    </div>
    <div className="grid gap-3">
      <Label htmlFor="city">City</Label>
      <Input
        id="city"
        type="text"
        className="w-full"
        {...form.register('city')}
      />
    </div>
    <div className="grid gap-3">
      <Label htmlFor="area">Area</Label>
      <Input
        id="area"
        type="text"
        className="w-full"
        {...form.register('area')}
      />
    </div> */}
                {/*     <div className="grid gap-3">
      <Label htmlFor="phone1">Phone 1</Label>
      <Input
        id="phone1"
        type="text"
        className="w-full"
        {...form.register('phone1')}
      />
    </div>
    <div className="grid gap-3">
      <Label htmlFor="phone2">Phone 2</Label>
      <Input
        id="phone2"
        type="text"
        className="w-full"
        {...form.register('phone2')}
      />
    </div> */}
    <div className="grid gap-3">
      <Label htmlFor="imei">IMEI</Label>
      <Input
        id="imei"
        type="text"
        className="w-full"
        {...form.register('imei')}
      />
    </div>
    <div className="grid gap-3">
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        type="password"
        className="w-full"
        {...form.register('password')}
      />
    </div>
  </div>
</CardContent>
</Card>
         
          <div className="lg:col-span-1 lg:row-span-2 lg:space-y-4">
  <Card x-chunk="dashboard-07-chunk-1">
    <CardHeader>
      <CardTitle>Address</CardTitle>
      <CardDescription>Enter your address details</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-semibold">Address</TableCell>
            <TableCell>
              <Label htmlFor="address" className="sr-only">Address</Label>
              <Input
                id="address"
                type="text"
                className="w-full"
                {...form.register('address')} // Register address input with the form
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">City</TableCell>
            <TableCell>
              <Label htmlFor="city" className="sr-only">City</Label>
              <Input
                id="city"
                type="text"
                className="w-full"
                {...form.register('city')} // Register city input with the form
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Area</TableCell>
            <TableCell>
              <Label htmlFor="area" className="sr-only">Area</Label>
              <Input
                id="area"
                type="text"
                className="w-full"
                {...form.register('area')} // Register area input with the form
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
    {/* Optional footer if needed */}
    {/* <CardFooter className="justify-center border-t p-4">
      <Button size="sm" variant="ghost" className="gap-1">
        <PlusCircle className="h-3.5 w-3.5" />
        Add Variant
      </Button>
    </CardFooter> */}
  </Card>
</div>
<div className="lg:col-span-1 lg:row-span-2 lg:space-y-4">
  <Card x-chunk="dashboard-07-chunk-2">
    <CardHeader>
      <CardTitle>Contact Information</CardTitle>
      <CardDescription>Enter your contact details</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-semibold">Email Address</TableCell>
            <TableCell>
              <Label htmlFor="email" className="sr-only">Email Address</Label>
              <Input
                id="email"
                type="email"
                className="w-full"
                {...form.register('email')} // Register email input with the form
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-semibold">Phone 1</TableCell>
            <TableCell>
              <Label htmlFor="phone1" className="sr-only">Phone 1</Label>
              <Input
                id="phone1"
                type="text"
                className="w-full"
                {...form.register('phone1')} // Register phone 1 input with the form
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-semibold">Phone 2</TableCell>
            <TableCell>
              <Label htmlFor="phone2" className="sr-only">Phone 2</Label>
              <Input
                id="phone2"
                type="text"
                className="w-full"
                {...form.register('phone2')} // Register phone 2 input with the form
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
    {/* Optional footer if needed */}
    {/* <CardFooter className="justify-center border-t p-4">
      <Button size="sm" variant="ghost" className="gap-1">
        Add Contact Detail
      </Button>
    </CardFooter> */}
  </Card>
  </div>

    
    {/* <Card>
      <CardHeader>
        <CardTitle>Product Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="grid gap-3">
            <Label htmlFor="category">Category</Label>
            <Select>
              <SelectTrigger id="category" aria-label="Select category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="subcategory">Subcategory (optional)</Label>
            <Select>
              <SelectTrigger id="subcategory" aria-label="Select subcategory">
                <SelectValue placeholder="Select subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="t-shirts">T-Shirts</SelectItem>
                <SelectItem value="hoodies">Hoodies</SelectItem>
                <SelectItem value="sweatshirts">Sweatshirts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>*/}
    </div> 


    <div className="grid  auto-rows-max items-start gap-4 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-3">
                  <CardHeader>
                    <CardTitle>Product Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="status">Status</Label>
                        <Select>
                          <SelectTrigger id="status" aria-label="Select status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                
                <Card
                  className="overflow-hidden" x-chunk="dashboard-07-chunk-4"
                >
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>
                Lipsum dolor sit amet, consectetur adipiscing elit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Image
                  alt="Product image"
                  className="aspect-square w-full rounded-md object-cover"
                  height="300"
                  src="/placeholder.svg"
                  width="300"
                />
                <div className="grid grid-cols-3 gap-2">
                  <button>
                    <Image
                      alt="Product image"
                      className="aspect-square w-full rounded-md object-cover"
                      height="84"
                      src="/placeholder.svg"
                      width="84"
                    />
                  </button>
                  <button>
                    <Image
                      alt="Product image"
                      className="aspect-square w-full rounded-md object-cover"
                      height="84"
                      src="/placeholder.svg"
                      width="84"
                    />
                  </button>
                  <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Upload</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-07-chunk-5">
            <CardHeader>
              <CardTitle>Archive Product</CardTitle>
<CardDescription>
                      Lipsum dolor sit amet, consectetur adipiscing elit.
                    </CardDescription>
            </CardHeader>
            <CardContent>
              <div></div>
                  <Button size="sm" variant="secondary">
                      Archive Product
                    </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            
 
</form>
 </Form>
    </>
  );
};

export default ProductForm;
