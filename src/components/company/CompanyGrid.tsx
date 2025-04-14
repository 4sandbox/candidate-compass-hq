
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Edit, MoreVertical, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Company } from '@/data/mockCompanies';

interface CompanyGridProps {
  companies: Company[];
  onEditClick: (company: Company) => void;
  onDeleteClick: (company: Company) => void;
}

const CompanyGrid: React.FC<CompanyGridProps> = ({ companies, onEditClick, onDeleteClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {companies.map((company) => (
        <Card key={company.id}>
          <CardHeader className="pb-3 flex flex-row justify-between items-start">
            <div>
              <CardTitle className="text-lg">{company.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{company.industry}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Mở menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditClick(company)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Chỉnh sửa</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => onDeleteClick(company)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Xóa</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            {company.website && (
              <p className="text-sm mb-2">
                <span className="font-medium">Website:</span>{" "}
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {company.website}
                </a>
              </p>
            )}
            {company.address && (
              <p className="text-sm mb-2">
                <span className="font-medium">Địa chỉ:</span> {company.address}
              </p>
            )}
            {company.description && (
              <p className="text-sm mb-2 line-clamp-3">
                <span className="font-medium">Mô tả:</span> {company.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-4">
              Đã tạo: {format(company.createdDate, 'dd/MM/yyyy')}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CompanyGrid;
