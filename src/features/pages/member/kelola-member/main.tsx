"use client"

import { trpc } from "@/utils/trpc"
import { useState } from "react"
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  UserCircle 
} from "lucide-react"
import { DialogCreateUser } from "./dialog-user"

// Helper function to format date
const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Helper function to generate pagination numbers
const GetPaginationNumbers = ({ 
  page, 
  pagination
}: { 
  page: number, 
  pagination: { 
    pageCount: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
  } 
}) => {
  const pageNumbers = []
  const maxVisiblePages = 5
  
  if (pagination.pageCount <= maxVisiblePages) {
    // Show all pages if total is less than max visible
    for (let i = 1; i <= pagination.pageCount; i++) {
      pageNumbers.push(i)
    }
  } else {
    // Always show first page
    pageNumbers.push(1)
    
    // Calculate start and end of page numbers to show
    let start = Math.max(2, page - 1)
    let end = Math.min(pagination.pageCount - 1, page + 1)
    
    // Adjust if we're near the beginning
    if (page <= 3) {
      end = Math.min(4, pagination.pageCount - 1)
    }
    
    // Adjust if we're near the end
    if (page >= pagination.pageCount - 2) {
      start = Math.max(2, pagination.pageCount - 3)
    }
    
    // Add ellipsis before middle numbers if needed
    if (start > 2) {
      pageNumbers.push(-1) // -1 represents ellipsis
    }
    
    // Add middle page numbers
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i)
    }
    
    // Add ellipsis after middle numbers if needed
    if (end < pagination.pageCount - 1) {
      pageNumbers.push(-2) // -2 represents ellipsis
    }
    
    // Always show last page
    pageNumbers.push(pagination.pageCount)
  }
  
  return pageNumbers
}

export function ManageMember() {
  const [page, setPage] = useState<number>(1)
  const perPage = 10
  const [filter, setFilter] = useState<string>("")
  
  const { data: membersData, isLoading } = trpc.member.findAll.useQuery({
    page,
    perPage,
    filter
  })


  
  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1)
  }
  
  const handleNextPage = () => {
    if (membersData && membersData.meta.page < membersData?.meta.pageCount) {
      setPage(page + 1)
    }
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1) 
  }
  
  return (
    <main className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Members</h1>
        <div className="flex space-x-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search members..."
            className="w-64"
            />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <DialogCreateUser>
            <Button>
                Create Member
            </Button>
        </DialogCreateUser>
      </div>
            </div>
      
      {/* Members Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>balance</TableHead>
              <TableHead>Terdaftar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : membersData?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No members found
                </TableCell>
              </TableRow>
            ) : (
              membersData?.data.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5 text-gray-400" />
                    {member.username}
                  </TableCell>
                  <TableCell>{member.username}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    {member.balance}
                  </TableCell>
                  <TableCell>{formatDate(member.createdAt as string)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {membersData && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing{' '}
            {membersData.data.length > 0 ? (page - 1) * perPage + 1 : 0} to{' '}
            {(page - 1) * perPage + membersData.data.length} of{' '}
            {membersData.meta.total} entries
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePreviousPage}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <div className="flex items-center gap-1">
              {GetPaginationNumbers({
                page,
                pagination: {
                  pageCount: membersData.meta.pageCount,
                  hasNextPage: page < membersData.meta.pageCount,
                  hasPreviousPage: page > 1
                },
              }).map((pageNumber) => (
                pageNumber < 0 ? (
                  <span key={pageNumber} className="px-2">...</span>
                ) : (
                  <Button
                    key={pageNumber}
                    variant={page === pageNumber ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(pageNumber)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNumber}
                  </Button>
                )
              ))}
            </div>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={page >= membersData?.meta.pageCount}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}