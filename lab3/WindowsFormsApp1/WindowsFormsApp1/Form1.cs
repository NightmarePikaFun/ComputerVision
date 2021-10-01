using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WindowsFormsApp1
{
	public partial class Form1 : Form
	{
		public Form1()
		{
			InitializeComponent();
		}

		private void GoToGray_Click(object sender, EventArgs e)
		{
			int count;
			try
			{
				count = int.Parse(textBox1.Text);
				if (count > 256)
				{
					count = 256;
				}
			}
			catch
			{
				count = 1;
			}
			double countHelper = 256 / count;
			Bitmap image = new Bitmap("test.bmp", true);
			Bitmap image2 = new Bitmap("test.bmp", true);
			pictureBox1.Image = image;
			int H = image.Height;
			int L = image.Width;
			pictureBox1.Width = L;
			pictureBox1.Height = H;
			//double countPixel;
			double[,] newGray = new double[H, L];
			double[,] newGrayG = new double[H, L];
			double[,] newGrayB = new double[H, L];
			Color pixelColor;
			int pixelColorGray;
			for (int j = 0; j < H; j++)
			{
				for (int i = 0; i < L; i++)
				{
					pixelColor = image.GetPixel(i, j);
					pixelColorGray = (int)(0.3 * image.GetPixel(i, j).R + 0.59 * image.GetPixel(i, j).G + 0.11 * image.GetPixel(i, j).B);

					image.SetPixel(i, j, Color.FromArgb(pixelColorGray, pixelColorGray, pixelColorGray));
				}
			}
			double bright=0;
			int R=0;
			int G=0;
			int B=0;
            double norm = 1;
            norm = norm / count;
			for (int i = 0; i < L; i++)
			{
				for (int j = 0; j < H; j++)
				{
					R = 0;
					G = 0;
					B = 0;
					pixelColor = image.GetPixel(i, j);
					//bright = pixelColor.GetBrightness()*255;
                    if(pixelColor.GetBrightness()<0.2)
                    {
                        pixelColor = Color.Black;
                    }
                    else if(pixelColor.GetBrightness()<0.4)
                    {
                        pixelColor = Color.Blue;
                    }
                    else if(pixelColor.GetBrightness()<0.45)
                    {
                        pixelColor = Color.Red;
                    }
                    else if(pixelColor.GetBrightness()<0.50)
                    {
                        pixelColor = Color.Yellow;
                    }
                    else
                    {
                        pixelColor = Color.Green;
                    }
                    //pixelColorGray = (int)(0.3 * image2.GetPixel(i, j).R + 0.59 * image2.GetPixel(i, j).G + 0.11 * image2.GetPixel(i, j).B);
                    image2.SetPixel(i, j, pixelColor);//Color.FromArgb(Math.Min(R,255), Math.Min( G, 255), Math.Min( B, 255)));
				}
			}
			pictureBox1.Image = image2;
		}


		public Bitmap returnImage(string path)
		{
			int count = 1;
			double countHelper = 256 / count;
			Bitmap image = new Bitmap(path, true);
			Bitmap image2 = new Bitmap(path, true);
			pictureBox1.Image = image;
			int H = image.Height;
			int L = image.Width;
			pictureBox1.Width = L;
			pictureBox1.Height = H;
			//double countPixel;
			double[,] newGray = new double[H, L];
			double[,] newGrayG = new double[H, L];
			double[,] newGrayB = new double[H, L];
			Color pixelColor;
			int pixelColorGray;
			for (int j = 0; j < H; j++)
			{
				for (int i = 0; i < L; i++)
				{
					pixelColor = image.GetPixel(i, j);
					pixelColorGray = (int)(0.3 * image.GetPixel(i, j).R + 0.59 * image.GetPixel(i, j).G + 0.11 * image.GetPixel(i, j).B);

					image2.SetPixel(i, j, Color.FromArgb(pixelColorGray, pixelColorGray, pixelColorGray));
				}
			}
			return image2;
		}

        public int[] returnCount(Bitmap image, int H, int L)
        {
            int[] count = new int[256];
            float bright;
            for (int i = 0; i < L; i++)
            {
                for (int j = 0; j < H; j++)
                {
                    bright = image.GetPixel(i, j).GetBrightness();
                    bright *= 255;
                    count[(int)bright]++;
                }
            }
            return count;
        }

        public double returnMatOj(int[] count)
        {
            double matOj = 0;
            for (int i = 0; i < count.Length; i++)
            {
                matOj += count[i] / 256;
            }
            return matOj;
        }

        public double[] returnD(int[] count,double matOj)
        {
            double[] D = new double[256];
            for (int i = 0; i < D.Length; i++)
            {
                D[i] = (count[i] - matOj) * (count[i] - matOj);
            }
            return D;
        }

        public double returnMatOj(double[] D)
        {
            double matOj = 0;
            for (int i = 0; i < D.Length; i++)
            {
                matOj += (D[i] / 256);
            }
            return matOj;
        }

        public double[] returnSC(int[] count, double matOj, double matOjD)
        {
            double[] sc = new double[256];
            double matOj1 = 0, matOj2 = 0;
            for (int i = 0; i < sc.Length; i++)
            {
                matOj1 = 0; matOj2 = 0;
                for (int j = 0; j <= i; j++)
                {
                    matOj1 += (count[j] - matOj) * (count[j] - matOj) / (i + 1);
                }
                for (int j = i + 1; j < 256; j++)
                {
                    matOj2 += (count[j] - matOj) * (count[j] - matOj) / (256 - i);
                }
                sc[i] = (matOj1 + matOj2) / matOjD;
            }
            return sc;
        }

        public int returnT(double[] sc)
        {
            int T = 0;
            double p = double.NegativeInfinity;
            for (int i = 0; i < 256; i++)
            {
                if (p < sc[i])
                {
                    p = sc[i];
                    T = i;
                }
            }
            return T;
        }

        public void Picture()
        {
			Bitmap image = returnImage("testA.bmp");//new Bitmap("testA.bmp", true);
            Bitmap image2 = returnImage("testA.bmp");//new Bitmap("testA.bmp", true);
            pictureBox1.Image = image;
            int H = image.Height/3;
            int L = image.Width/2;
            pictureBox1.Width = L*2;
            pictureBox1.Height = H*3;
            int lenght = 6;
            int[][] count = new int[lenght][];
            count[0] = returnCount(image,H,L);
            count[1] = returnCount(image, H,L*2);
            count[2] = returnCount(image, H*2, L);count[3] = returnCount(image, H*2, L*2);
            count[4] = returnCount(image, H*2, L);
            count[5] = returnCount(image, H*3, L*2);
            double[] matOj = new double[lenght];
            double[][] D = new double[lenght][];
            double[] matOjD = new double[lenght];
            double[][] sc = new double[lenght][];
            int[] T = new int[lenght];
            for (int i = 0; i<count.Length;i++)
            {
                matOj[i] = returnMatOj(count[i]);
                D[i] = returnD(count[i], matOj[i]);
                matOjD[i] = returnMatOj(D[i]);
                sc[i] = returnSC(count[i], matOj[i], matOjD[i]);
                T[i] = returnT(sc[i]);
            }
            #region helper
            for (int i = 0; i < L; i++)
            {
                for (int j = 0; j < H; j++)
                {
                    if (image2.GetPixel(i, j).GetBrightness() < ((double)(T[0]) / 255))
                    {
                        image2.SetPixel(i, j, Color.Black);
                    }
                    else
                    {
                        image2.SetPixel(i, j, Color.White);
                    }
                }
            }
            for (int i = 0; i < L; i++)
            {
                for (int j = H; j < H*2; j++)
                {
                    if (image2.GetPixel(i, j).GetBrightness() < ((double)(T[1]) / 255))
                    {
                        image2.SetPixel(i, j, Color.Black);
                    }
                    else
                    {
                        image2.SetPixel(i, j, Color.White);
                    }
                }
            }
            for (int i = 0; i < L; i++)
            {
                for (int j = H*2; j < H * 3; j++)
                {
                    if (image2.GetPixel(i, j).GetBrightness() < ((double)(T[2]) / 255))
                    {
                        image2.SetPixel(i, j, Color.Black);
                    }
                    else
                    {
                        image2.SetPixel(i, j, Color.White);
                    }
                }
            }
            for (int i = L; i < L*2; i++)
            {
                for (int j = 0; j < H; j++)
                {
                    if (image2.GetPixel(i, j).GetBrightness() < ((double)(T[3]) / 255))
                    {
                        image2.SetPixel(i, j, Color.Black);
                    }
                    else
                    {
                        image2.SetPixel(i, j, Color.White);
                    }
                }
            }
            for (int i = L; i < L*2; i++)
            {
                for (int j = H; j < H * 2; j++)
                {
                    if (image2.GetPixel(i, j).GetBrightness() < ((double)(T[4]) / 255))
                    {
                        image2.SetPixel(i, j, Color.Black);
                    }
                    else
                    {
                        image2.SetPixel(i, j, Color.White);
                    }
                }
            }
            for (int i = L; i < L*2; i++)
            {
                for (int j = H*2; j < H * 3; j++)
                {
                    if (image2.GetPixel(i, j).GetBrightness() < ((double)(T[4]) / 255))
                    {
                        image2.SetPixel(i, j, Color.Black);
                    }
                    else
                    {
                        image2.SetPixel(i, j, Color.White);
                    }
                }
            }
            #endregion
            /*double K = 0;
            for(int i = 0; i<T.Length;i++)
            {
                K += T[i];
            }
            K = K / T.Length;
            for (int i = 0; i < L*2; i++)
            {
                for (int j = 0; j < H*3; j++)
                {
                    if (image2.GetPixel(i, j).GetBrightness() < (K / 255))
                    {
                        image2.SetPixel(i, j, Color.Black);
                    }
                    else
                    {
                        image2.SetPixel(i, j, Color.White);
                    }
                }
            }*/
            pictureBox1.Image = image2;
        }

        ///дописать на много Т, не меньше 16 в зоне (15 разделений)
        private void goToOtsu_Click(object sender, EventArgs e)
        {
            int[] count = new int[256];
            Bitmap image = new Bitmap("testA.bmp", true);
            Bitmap image2 = new Bitmap("testA.bmp", true);
            pictureBox1.Image = image;
            int H = image.Height;
            int L = image.Width;
            pictureBox1.Width = L;
            pictureBox1.Height = H;
            float bright;
            for(int i = 0; i < L;i++)
            {
                for(int j = 0; j <H;j++)
                {
                    bright = image.GetPixel(i, j).GetBrightness();
                    bright *= 255;
                    count[(int)bright]++;
                }
            }
            double matOj = 0;
            for(int i = 0; i < count.Length;i++)
            {
                matOj += count[i] / 256;
            }
            double[] D = new double[256];
            double matOjD = 0;
            for(int i = 0; i < D.Length;i++)
            {
                D[i] = (count[i]-matOj) * (count[i] - matOj);
                matOjD += (D[i] / 256);
            }
            double[] sc = new double[256];
            double matOj1 = 0, matOj2 = 0;
            for(int i = 0; i < sc.Length;i++)
            {
                matOj1 = 0; matOj2 = 0;
                for (int j = 0; j<=i;j++)
                {
                    matOj1 += (count[j] - matOj) * (count[j] - matOj) / (i+1) ;
                }
                for(int j = i+1;j<256;j++)
                {
                    matOj2 += (count[j] - matOj) * (count[j] - matOj)/(256-i);
                }
                sc[i] = (matOj1+matOj2)/matOjD;
            }
            double p = 0;
            int[] T = new int[16];
            for (int k = 0; k < T.Length; k++)
            {
                p = double.NegativeInfinity;
                for (int i = 16*k; i < 16*k+16; i++)
                {
                    if (p < sc[i])
                    {
                        p = sc[i];
                        T[k] = i;
                    }
                }
            }
            p = p / 45;
            int l = 0;
            for (int i = 0; i < L; i++)
            {
                for (int j = 0; j < H; j++)
                {
                    l = (int)image2.GetPixel(i, j).GetBrightness();
                    l += 1;
                    if(image2.GetPixel(i, j).GetBrightness() < ((double)(T[l]) / 255))
                    {
                        image2.SetPixel(i, j, Color.Black);
                    }
                    else
                    {
                        image2.SetPixel(i, j, Color.White);
                    }
                }
            }
            pictureBox1.Image = image2;
        }



        private void otsu2_Click(object sender, EventArgs e)
        {
            //Recurent();
            int[] count = new int[256];
			Bitmap image = returnImage("testA.bmp");//new Bitmap("test2.bmp", true);
            Bitmap image2 = returnImage("testA.bmp");//new Bitmap("test2.bmp", true);
			pictureBox1.Image = image;
            int H = image.Height;
            int L = image.Width;
            pictureBox1.Width = L;
            pictureBox1.Height = H;
            float bright;
            for (int i = 0; i < L; i++)
            {
                for (int j = 0; j < H; j++)
                {
                    bright = image.GetPixel(i, j).GetBrightness();
                    bright *= 255;
                    count[(int)bright]++;
                }
            }
            double matOj = 0;
            for (int i = 0; i < count.Length; i++)
            {
                matOj += count[i] / 256;
            }
            double[] D = new double[256];
            double matOjD = 0;
            for (int i = 0; i < D.Length; i++)
            {
                D[i] = (count[i] - matOj) * (count[i] - matOj);
                matOjD += (D[i] / 256);
            }
            double[] sc = new double[256];
            double matOj1 = 0, matOj2 = 0;
            for (int i = 0; i < sc.Length; i++)
            {
                matOj1 = 0; matOj2 = 0;
                for (int j = 0; j <= i; j++)
                {
                    matOj1 += (count[j] - matOj) * (count[j] - matOj) / (i + 1);
                }
                for (int j = i + 1; j < 256; j++)
                {
                    matOj2 += (count[j] - matOj) * (count[j] - matOj) / (256 - i);
                }
                sc[i] = (matOj1 + matOj2) / matOjD;
            }
            double p = double.NegativeInfinity;
            int T = 0;
            for (int i = 0; i < 256; i++)
            {
                if (p < sc[i])
                {
                    p = sc[i];
                    T = i;
                }
            }
            p = p / 45;

            for (int i = 0; i < L; i++)
            {
                for (int j = 0; j < H; j++)
                {
                    if (image2.GetPixel(i, j).GetBrightness() < ((double)(T) / 255))
                    {
                        image2.SetPixel(i, j, Color.Black);
                    }
                    else
                    {
                        image2.SetPixel(i, j, Color.White);
                    }
                }
            }
            pictureBox1.Image = image2;
        }


        public void OTSU()
        {
            int[] count = new int[256];
            Bitmap image = new Bitmap("test.bmp", true);
            Bitmap image2 = new Bitmap("test.bmp", true);
            pictureBox1.Image = image;
            int H = image.Height;
            int L = image.Width;
            pictureBox1.Width = L;
            pictureBox1.Height = H;
            float bright;
            for (int i = 0; i < L; i++)
            {
                for (int j = 0; j < H; j++)
                {
                    bright = image.GetPixel(i, j).GetBrightness();
                    bright *= 255;
                    count[(int)bright]++;
                }
            }
            double[] o1 = new double[256], o2 = new double[256], ow = new double[256], mu1 = new double[256], mu2 = new double[256], q1 = new double[256], q2 = new double[256];

        }

        public void N()
        {        
            int[] count = new int[256];
            Bitmap image = new Bitmap("testA.bmp", true);
            Bitmap image2 = new Bitmap("testA.bmp", true);
            pictureBox1.Image = image;
            int H = image.Height;
            int L = image.Width;
            pictureBox1.Width = L;
            pictureBox1.Height = H;
            float bright;
            for(int i = 0; i < L;i++)
            {
                for(int j = 0; j <H;j++)
                {
                    bright = image.GetPixel(i, j).GetBrightness();
                    bright *= 255;
                    count[(int)bright]++;
                }
            }

        }

        #region recurent
        public static double[] q1 = new double[256];
        public static double[] statist = new double[256];
        public static double[] mu1 = new double[256];
        public static double[] mu2 = new double[256];

        public void Recurent()
        {
            Bitmap image = new Bitmap("test.bmp", true);
            Bitmap image2 = new Bitmap("test.bmp", true);
            pictureBox1.Image = image;
            int H = image.Height;
            int L = image.Width;
            pictureBox1.Width = L;
            pictureBox1.Height = H;
            float bright;
            for (int i = 0; i < L; i++)
            {
                for (int j = 0; j < H; j++)
                {
                    bright = image.GetPixel(i, j).GetBrightness();
                    bright *= 255;
                    statist[(int)bright]++;
                }
            }
            rasQ(255);
            rasMU1(255);
            rasMU2(255);
            double[] omega = new double[256];
            double p = double.NegativeInfinity;
            int T = 0;
            for (int i =0; i<256;i++)
            {
                omega[i] = q1[i] * (1 - q1[i]) * (mu1[i] - mu2[i]) * (mu1[i] - mu2[i]);
                omega[i] = Math.Sqrt(Math.Abs(omega[i]));
                if(omega[i]>p)
                {
                    p = omega[i];
                    T = i;
                }
            }
            for (int i = 0; i < L; i++)
            {
                for (int j = 0; j < H; j++)
                {
                    if (image2.GetPixel(i, j).GetBrightness() < ((double)(T) / 255))
                    {
                        image2.SetPixel(i, j, Color.Black);
                    }
                    else
                    {
                        image2.SetPixel(i, j, Color.White);
                    }
                }
            }
            pictureBox1.Image = image2;

        }

        public double rasQ(int t)
        {
            if(t==0)
            {
                q1[t] = statist[t+1];
                return q1[t];
            }
            else
            {
                return q1[t] = rasQ(t - 1) + statist[t];
            }
        }

        public double rasMU1(int t)
        {
            if(t==0)
            {
                mu1[t] = 1;
                return mu1[t];
            }
            else
            {
                mu1[t] = q1[t - 1] * rasMU1(t - 1) + t * statist[t];
                mu1[t] = mu1[t] / q1[t];
                return mu1[t];
            }
        }

        public double rasMU2(int t)
        {
            if (t == 0)
            {
                mu2[t] = 0;
                return mu2[t];
            }
            else
            {
                double mu = q1[t - 1] * mu1[t - 1] + rasMU2(t - 1) * q1[t];
                mu2[t] = mu - q1[t] * mu1[t];
                if (1 - q1[t] == 0)
                {
                    mu2[t] = mu2[t];
                }
                else
                {
                    mu2[t] = mu2[t] / (1 - q1[t]);
                }
                return mu2[t];
            }
        }

        #endregion

        private void goToOtsu3_Click(object sender, EventArgs e)
        {
            Picture();
        }
    }
}
