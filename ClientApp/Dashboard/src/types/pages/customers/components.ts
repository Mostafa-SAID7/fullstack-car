// Customers Page Component Types

export interface CustomersTableProps {
  users: any[];
  loading?: boolean;
  onUserClick?: (user: any) => void;
  onUserEdit?: (user: any) => void;
  onUserDelete?: (userId: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}
