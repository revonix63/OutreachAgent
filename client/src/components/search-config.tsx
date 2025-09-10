import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { searchConfigSchema, SearchConfig } from "@shared/schema";

interface SearchConfigProps {
  onRunDiscovery: (config: SearchConfig) => void;
}

export default function SearchConfigComponent({ onRunDiscovery }: SearchConfigProps) {
  const form = useForm<SearchConfig>({
    resolver: zodResolver(searchConfigSchema),
    defaultValues: {
      location: "",
      businessType: "Cafes & Coffee Shops",
      filters: {
        noWebsite: true,
        socialOnly: true,
        outdatedSite: true,
        independentOnly: false,
        verifiedOwner: false,
        activeSocial: false,
      },
    },
  });

  const onSubmit = (data: SearchConfig) => {
    onRunDiscovery(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Sedona, AZ" 
                        {...field}
                        data-testid="input-location"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-business-type">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Cafes & Coffee Shops">Cafes & Coffee Shops</SelectItem>
                        <SelectItem value="Restaurants">Restaurants</SelectItem>
                        <SelectItem value="Bars & Pubs">Bars & Pubs</SelectItem>
                        <SelectItem value="Retail Stores">Retail Stores</SelectItem>
                        <SelectItem value="Beauty Salons">Beauty Salons</SelectItem>
                        <SelectItem value="Fitness Centers">Fitness Centers</SelectItem>
                        <SelectItem value="Professional Services">Professional Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">Search Filters</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="filters.noWebsite"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-no-website"
                        />
                      </FormControl>
                      <FormLabel className="text-sm">No Website</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="filters.socialOnly"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-social-only"
                        />
                      </FormControl>
                      <FormLabel className="text-sm">Social Only</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="filters.outdatedSite"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-outdated-site"
                        />
                      </FormControl>
                      <FormLabel className="text-sm">Outdated Site</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="filters.independentOnly"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-independent-only"
                        />
                      </FormControl>
                      <FormLabel className="text-sm">Independent Only</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="filters.verifiedOwner"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-verified-owner"
                        />
                      </FormControl>
                      <FormLabel className="text-sm">Verified Owner</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="filters.activeSocial"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-active-social"
                        />
                      </FormControl>
                      <FormLabel className="text-sm">Active Social</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" data-testid="button-start-discovery">
                Start Discovery
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
