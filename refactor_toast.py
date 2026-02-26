import re
import sys

def refactor(filename):
    with open(filename, 'r') as f:
        content = f.read()

    # Add imports if not present
    if "import { notify } from '@/lib/notify';" not in content:
        content = re.sub(r'import \{ useToast \} from \'@/components/ui/use-toast\';', "import { notify } from '@/lib/notify';", content)
        content = re.sub(r'import { useToast } from "@/components/ui/use-toast";', 'import { notify } from "@/lib/notify";', content)

    # Remove `const { toast } = useToast();`
    content = re.sub(r' +const \{ toast \} = useToast\(\);?\n', '', content)

    # Replace toast.success('...', { title: '...' })
    content = re.sub(r'toast\.success\(([^,]+),\s*\{\s*title:\s*([^\}]+)\s*\}\);', r'notify.success(\1, \2);', content)

    # Replace toast({ title: X, description: Y, variant: Z })
    # It might be multiline.
    pattern = r'toast\(\s*\{\s*title:\s*([^,]+),\s*description:\s*([^,]+),\s*variant:\s*\'([^\']+)\'\s*\}\s*\);'
    def replacer(m):
        title = m.group(1).strip()
        description = m.group(2).strip()
        variant = m.group(3)
        return f"notify.{variant}({description}, {title});"
    
    content = re.sub(pattern, replacer, content, flags=re.MULTILINE)

    with open(filename, 'w') as f:
        f.write(content)

for arg in sys.argv[1:]:
    refactor(arg)
