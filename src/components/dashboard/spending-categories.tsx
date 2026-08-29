import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { spendingCategories } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format-currency";

export function SpendingCategories() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Spending by category</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="space-y-5">
                    {spendingCategories.map((category) => (
                        <div key={category.name}>
                            <div className="mb-2 flex items-center justify-between text-sm">
                                <span className="font-medium">
                                    {category.name}
                                </span>

                                <span className="text-muted-foreground">
                                    {formatCurrency(category.amount)}
                                </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full bg-primary"
                                    style={{
                                        width: `${category.percentage}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}