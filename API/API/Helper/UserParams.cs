using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helper
{
    public class UserParams
    {
        private const int MazPageZize=50;
        public int pageNumber { get; set; }
        public int MinAge { get; set; }=18;
        public int MaxAge { get; set; }=150;
        private int _pageSize=10;
        public int PageSize
        {
            get=> _pageSize;
            set => _pageSize=(value > MazPageZize)?MazPageZize:value;
        }

        public string CurrentUsername { get; set; }
        public string Gender { get; set; }

        public string OrderBy { get; set; }="lastActive";
    }
}