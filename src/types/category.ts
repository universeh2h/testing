export type Category = {
  id: number; // Sesuai dengan `id` di Prisma (Int)
  nama: string; // Sesuai dengan `nama` di Prisma (String)
  subNama: string; // Sesuai dengan `subNama` di Prisma (String)
  brand: string; // Sesuai dengan `brand` di Prisma (String @db.Text)
  kode: string | null; // Sesuai dengan `kode` di Prisma (String?)
  serverId: number; // Sesuai dengan `serverId` di Prisma (Int)
  status: string; // Sesuai dengan `status` di Prisma (String, default "active")
  thumbnail: string; // Sesuai dengan `thumbnail` di Prisma (String)
  tipe: string; // Sesuai dengan `tipe` di Prisma (String, default "game")
  petunjuk: string | null; // Sesuai dengan `petunjuk` di Prisma (String?)
  ketLayanan: string | null; // Sesuai dengan `ketLayanan` di Prisma (String? @db.Text)
  ketId: string | null; // Sesuai dengan `ketId` di Prisma (String? @db.Text)
  placeholder1: string; // Sesuai dengan `placeholder1` di Prisma (String @db.Text)
  placeholder2: string; // Sesuai dengan `placeholder2` di Prisma (String @db.Text)
  createdAt: string | null; // Sesuai dengan `createdAt` di Prisma (DateTime?)
  updatedAt: string | null; // Sesuai dengan `updatedAt` di Prisma (DateTime?)
  bannerLayanan: string; // Sesuai dengan `bannerLayanan` di Prisma (String)
};
export type SubCategories = {
  name: string;
  id: number;
  createdAt: string;
  updatedAt: string;
  code: string;
  categoryId: number;
  active: boolean;
};

export type PlansProps = {
  id: number;
  subCategoryId: number;
  providerId: string;
  layanan: string;
  harga: number;
  hargaFlashSale : number | null
  isFlashSale : boolean
};
