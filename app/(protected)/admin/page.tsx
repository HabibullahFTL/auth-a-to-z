'use client';

import { changeRole } from '@/actions/change-role';
import Loader from '@/components/common/loader';
import FormError from '@/components/form-status/form-error';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessageByCode } from '@/lib/handlers/generate-message';
import { IResponse } from '@/types/common';
import { User, UserRole } from '@prisma/client';
import { useEffect, useState, useTransition } from 'react';
import { FaUserEdit } from 'react-icons/fa';

const AdminPage = () => {
  const { toast } = useToast();

  const [isFetching, startFetching] = useTransition();
  const [response, setResponse] = useState<IResponse<User[]>>();
  const [roleChangeModalData, setRoleChangeModalData] = useState<{
    id: string;
    currentRole: UserRole;
  }>();

  const userRoles: UserRole[] = ['USER', 'ADMIN', 'BLOCKED'];

  console.log({ roleChangeModalData });

  useEffect(() => {
    const fetchUsers = async () => {
      const resPromise = await fetch(`/api/users`);
      const users = await resPromise.json();
      setResponse(users);
      console.log({ resPromise, users });
    };

    startFetching(async () => {
      await fetchUsers();
    });
  }, []);

  const updateUserRole = async (userId: string, role: UserRole) => {
    toast({
      variant: 'loading',
      title: 'Updating the user role',
    });

    const updatedUserData = await changeRole(userId, role);
    toast({
      variant: 'default',
      title: 'Updated the user role.',
    });

    if (updatedUserData) {
      setResponse((prev) => {
        return !prev
          ? prev
          : {
              ...prev,
              data: prev?.data?.map((item) => {
                return item?.id === userId
                  ? { ...item, ...(updatedUserData?.data || {}) }
                  : item;
              }),
            };
      });
    }

    setRoleChangeModalData(undefined);
  };

  return (
    <div className="w-full bg-white rounded px-3 py-2 flex-col flex justify-between items-center">
      <h3 className="text-4xl text-center font-semibold mb-6 w-full">
        🔑 Admin Page
      </h3>
      <div className="w-full">
        {isFetching || !response ? (
          <Loader type="relative" />
        ) : (
          <div>
            {!response?.success && (
              <FormError
                message={getErrorMessageByCode(response?.code || '')}
              />
            )}

            {response?.data && (
              <Table className="w-full">
                <TableHeader className="bg-sky-600">
                  <TableRow>
                    <TableHead className="w-[100px] font-semibold text-white">
                      User Id
                    </TableHead>
                    <TableHead className="font-semibold text-white">
                      Name
                    </TableHead>
                    <TableHead className="font-semibold text-white">
                      Email
                    </TableHead>
                    <TableHead className="font-semibold text-white">
                      Role
                    </TableHead>
                    <TableHead className="text-right font-semibold text-white">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(response?.data || [])?.map((item) => (
                    <TableRow key={item?.id}>
                      <TableCell>
                        <div className="w-[90px] truncate">{item?.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="w-[140px] truncate">{item?.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="w-[120px] truncate">{item?.email}</div>
                      </TableCell>
                      <TableCell>{item?.role}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() =>
                            setRoleChangeModalData({
                              id: item?.id,
                              currentRole: item?.role,
                            })
                          }
                        >
                          <FaUserEdit />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}

        <div className="py-2 px-2 text-muted-foreground text-sm text-center italic">
          N.B.: This page is only reserved for the role{' '}
          <span className="font-semibold">ADMIN</span>
        </div>
      </div>
      <Dialog
        open={!!roleChangeModalData}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setRoleChangeModalData(undefined);
          }
        }}
      >
        <DialogContent>
          <DialogTitle>Change the user role</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-x-3">
                <h3 className="font-semibold">Role</h3>
                <Select
                  onValueChange={(value) => {
                    setRoleChangeModalData(
                      roleChangeModalData
                        ? {
                            ...roleChangeModalData,
                            currentRole: value as UserRole,
                          }
                        : undefined
                    );
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={roleChangeModalData?.currentRole}
                    />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {userRoles?.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    if (roleChangeModalData) {
                      updateUserRole(
                        roleChangeModalData?.id,
                        roleChangeModalData?.currentRole
                      );
                    }
                  }}
                >
                  Change
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
