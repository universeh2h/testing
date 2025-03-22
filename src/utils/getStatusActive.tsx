import { Badge } from '@/components/ui/badge';

export const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return <Badge>{status}</Badge>;
    case 'unactive':
      return <Badge variant="destructive">{status}</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};
