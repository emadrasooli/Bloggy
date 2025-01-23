"use client";

import CategoryForm from "@/components/CategoryForm";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiHome } from "react-icons/hi2";
import { IoPerson } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import Link from "next/link";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { toast, ToastContainer } from "react-toastify";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [editCategory, setEditCategory] = useState<{ id: string; name: string } | null>(null);

  const handleLogout = async () => {
    signOut({ callbackUrl: "/" });
    setIsLogoutDialogOpen(false);
  };

  const { isLoading: isLoadingUser, error: userError, data: userData } = useQuery<UserData[], Error>({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return await response.json();
    },
  });

  const { isLoading: isLoadingCategories, error: categoriesError, data: categoryData } = useQuery({
    queryKey: ['category'],
    queryFn: async () => {
      const response = await fetch('/api/category');
      if (!response.ok) throw new Error('Failed to fetch category');
      return await response.json();
    },
  });

  useEffect(() => {
    if (userData) {
      setUsers(userData);
    }
  }, [userData]);

  const saveCategoryMutation = useMutation({
    mutationFn: async ({ id, name }: { id?: string; name: string }) => {
      const response = await fetch("/api/category", {
        method: id ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id ? { id, name } : { name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData.error || "Failed to save category");   
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category'] });
      setEditCategory(null);
    },
    onError: (error) => {
      console.error(`Error saving category: ${error}`);
    }
  });

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      console.log(categoryId);
        const response = await fetch('/api/category', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: categoryId }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to delete category');
        }

        toast.success(data.message, {
          position: "bottom-right"
        });
        queryClient.invalidateQueries({ queryKey: ['category'] });
        setIsCategoryDialogOpen(false);
    } catch (error) {
        if (error instanceof Error) {
            toast.error(`Error: ${error.message}`);
        } else {
            toast.error(`Error: , ${error}`);
        }
    }
};

  const handleSaveCategory = async (name: string, id?: string) => {
    await saveCategoryMutation.mutateAsync({ id, name });
  };

  const handleEditCategory = (category: { id: string; name: string }) => {
    setEditCategory(category);
  };

  if (userError || categoriesError) {
    return (
      <div className='flex flex-col justify-center items-center h-screen text-lg font-medium text-red-500'>
        An Error occurred
      </div>
    );
  }

  return (
    <div className="text-white max-w-3xl mx-auto p-6 flex flex-col space-y-6">
      <h1 className="text-3xl font-medium">Admin Dashboard</h1>
      <Button onClick={() => router.push("/")} variant={"link"} className="text-gray-300 w-fit">
        <HiHome />Home
      </Button>
      <div className="bg-white text-black p-4 flex flex-row items-center space-x-4 relative rounded-xl">
        <div>
          <IoPerson size={40} />
        </div>
        <div>
          <p className="text-lg font-semibold flex items-center gap-2">
            {session?.user?.name}{" "}
            <span className="text-xs text-white bg-green-700 px-2 rounded-full">
              {session?.user?.role}
            </span>
          </p>
          <p className="text-gray-600 text-medium">{session?.user?.email}</p>
        </div>
        <Button onClick={() => {
          setIsLogoutDialogOpen(true);
        }} variant={"destructive"} className="absolute right-4">
          Logout
        </Button>
      </div>
      <CategoryForm editCategory={editCategory} onSave={handleSaveCategory} />
      <h3 className="text-xl font-medium">All Categories</h3>
      {isLoadingCategories ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryData.map((category: { id: string; name: string }) => (
            <div key={category.id} className="bg-white py-2 px-3 rounded-lg text-black text-center relative flex flex-row items-center justify-center">
              <FaRegEdit
                onClick={() => handleEditCategory(category)}
                className="absolute left-4 cursor-pointer"
              />
              <p className="text-sm font-medium">{category.name}</p>
              <IoCloseCircle
                onClick={() => {
                  setCategoryToDelete(category);
                  setIsCategoryDialogOpen(true);
                }}
                className="absolute -right-2 -top-3 text-red-500 h-6 w-6 cursor-pointer bg-black rounded-full" />
            </div>
          ))}
        </div>
      )}
      <h3 className="text-xl font-medium">All Users</h3>
      {isLoadingUser ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white text-black p-4 flex flex-row items-center space-x-4 relative rounded-xl">
              <div>
                <IoPerson size={40} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Link href={`/profile/${user.id}`} className="text-xl font-semibold flex items-center gap-2 hover:underline underline-offset-2 ">
                    {user.name}
                  </Link>
                  <span className="text-xs text-white bg-green-700 px-2 rounded-full">
                    {user.role}
                  </span>
                </div>
                <p className="text-gray-600 text-medium">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <ToastContainer />

      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className='text-black'>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{categoryToDelete?.name}</strong> category?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDeleteCategory(categoryToDelete?.id || "")}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className='text-black'>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to Logout?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}