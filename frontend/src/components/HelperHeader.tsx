import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CompilerSliceStateType,
  updateCurrentLanguage,
} from "@/redux/slices/compilerSlice";
import { RootState } from "@/redux/store";
import { Code, Copy, Loader2, Save, Share2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { handleError } from "@/utils/handleError";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const HelperHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {urlId} = useParams()

  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [shareBtn, setShareBtn] = useState<boolean>(false)

  useEffect(() => {
    if(urlId){
      setShareBtn(true)
    }else{
      setShareBtn(false)
    }
  } , [urlId])
  const currentLanguage = useSelector(
    (state: RootState) => state.compilerSlice.currentLanguage
  );

  const fullCode = useSelector(
    (state: RootState) => state.compilerSlice.fullCode
  );

  const handleSaveCode = async () => {
    setSaveLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/compiler/save", {
        fullCode: fullCode,
      });
      console.log(response.data);
      navigate(`/compiler/${response.data.url}`, { replace: true });
    } catch (error) {
      handleError(error);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="helper-header h-[50px] bg-black text-white p-2 flex items-center justify-between">
      <div className="btn-container flex gap-1">
        <Button
          variant="success"
          className="flex justify-center items-center gap-1"
          onClick={handleSaveCode}
          disabled={saveLoading}
        >
          {" "}
          {saveLoading ? (
            <>
              <Loader2 className="animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save size={16} /> Save
            </>
          )}
        </Button>

        {
          shareBtn && <Dialog>
          <DialogTrigger className="whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 flex justify-center items-center gap-1">
            <Share2 size={16} />
            Share
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex gap-1 items-center justify-center">
                {" "}
                <Code /> Share your Code!
              </DialogTitle>
              <DialogDescription className="flex flex-col gap-2">
                <div className="flex gap-1">
                  <input
                    type="text"
                    disabled
                    className="w-full px-2 py-2 text-slate-400 rounded-md bg-slate-800"
                    value={window.location.href}
                  />
                  <Button variant="outline">
                    <Copy
                      size={14}
                      onClick={() => {
                        window.navigator.clipboard.writeText(
                          window.location.href
                        );
                        toast("URL Copied");
                      }}
                    />
                  </Button>
                </div>
                <p className="text-center">Share this URL to collborate</p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        }
        
      </div>

      <div className="tab-switcher flex justify-center items-center">
        <small>Current Language: &nbsp; </small>
        <Select
          defaultValue={currentLanguage}
          onValueChange={(value) =>
            dispatch(
              updateCurrentLanguage(
                value as CompilerSliceStateType["currentLanguage"]
              ) //13100 typcaasting that value can be either of the interface of current language
            )
          }
        >
          <SelectTrigger className="w-[120px] bg-gray-800 focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="css">CSS</SelectItem>
            <SelectItem value="javascript">JavaSript</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default HelperHeader;
