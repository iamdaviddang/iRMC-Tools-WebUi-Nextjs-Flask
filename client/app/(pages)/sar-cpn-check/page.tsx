import { SarForm } from "./_components/sar-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaRegFileAlt } from "react-icons/fa";

const page = () => {
  return (
    <div className="flex justify-center">
      <Card className="w-max mt-20">
        <CardHeader>
          <CardTitle>
            <div className="flex gap-2">
              <FaRegFileAlt className="h-4 w-4 text-primary" />
              Check SAR/CPN file change
            </div>
          </CardTitle>
          <CardDescription>
            This tool will help you to find out if the SAR file has been
            regenerated or when the last change was.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SarForm />
        </CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Card>
    </div>
  );
};

export default page;
