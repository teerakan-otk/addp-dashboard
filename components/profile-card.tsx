"use client";

import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";

type Props = {
  title: string;
  children?: any;
};

export function ProfileCard({ title, children }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
