using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using CommandLine;
using CommandLine.Text;

namespace MongoExtract {
    public class Options {
        [Option('d', "database", Required = true, HelpText = "The database to extract from.")]
        public string Database {
            get;
            set;
        }

        [Option('c', "collection", Required = true, HelpText = "The collection to extract.")]
        public string Collection {
            get;
            set;
        }

        [Option('o', "output-directory", HelpText = "The output directory to write the doucments to.")]
        public string OutputDirectory {
            get;
            set;
        }

        [Option('i', "id", Required = true, Separator = ',', HelpText = "The path to the id field used for the filename.")]
        public IList<string> IdPaths {
            get;
            set;
        }

        [Option('f', "id-format", Default = "{0}", HelpText = "A C# format string that will passed the id value to generate a filename.")]
        public string IdFormat {
            get;
            set;
        }

        [Option("strip-id", Default = false, HelpText = "Flag if the id field should be removed before saving.")]
        public bool StripId {
            get;
            set;
        }

        [Option('p', "precission", Default = 2, HelpText = "The precission to restrict floating point data to.")]
        public int Precission {
            get;
            set;
        }
    }
}
