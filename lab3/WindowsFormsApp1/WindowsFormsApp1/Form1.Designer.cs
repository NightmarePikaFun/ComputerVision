namespace WindowsFormsApp1
{
	partial class Form1
	{
		/// <summary>
		/// Обязательная переменная конструктора.
		/// </summary>
		private System.ComponentModel.IContainer components = null;

		/// <summary>
		/// Освободить все используемые ресурсы.
		/// </summary>
		/// <param name="disposing">истинно, если управляемый ресурс должен быть удален; иначе ложно.</param>
		protected override void Dispose(bool disposing)
		{
			if (disposing && (components != null))
			{
				components.Dispose();
			}
			base.Dispose(disposing);
		}

		#region Код, автоматически созданный конструктором форм Windows

		/// <summary>
		/// Требуемый метод для поддержки конструктора — не изменяйте 
		/// содержимое этого метода с помощью редактора кода.
		/// </summary>
		private void InitializeComponent()
		{
			this.pictureBox1 = new System.Windows.Forms.PictureBox();
			this.GoToGray = new System.Windows.Forms.Button();
			this.textBox1 = new System.Windows.Forms.TextBox();
			this.goToOtsu = new System.Windows.Forms.Button();
			this.otsu2 = new System.Windows.Forms.Button();
			this.goToOtsu3 = new System.Windows.Forms.Button();
			((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
			this.SuspendLayout();
			// 
			// pictureBox1
			// 
			this.pictureBox1.Location = new System.Drawing.Point(13, 13);
			this.pictureBox1.Name = "pictureBox1";
			this.pictureBox1.Size = new System.Drawing.Size(588, 459);
			this.pictureBox1.TabIndex = 0;
			this.pictureBox1.TabStop = false;
			// 
			// GoToGray
			// 
			this.GoToGray.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
			this.GoToGray.Location = new System.Drawing.Point(13, 504);
			this.GoToGray.Name = "GoToGray";
			this.GoToGray.Size = new System.Drawing.Size(75, 44);
			this.GoToGray.TabIndex = 1;
			this.GoToGray.Text = "quant";
			this.GoToGray.UseVisualStyleBackColor = true;
			this.GoToGray.Click += new System.EventHandler(this.GoToGray_Click);
			// 
			// textBox1
			// 
			this.textBox1.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
			this.textBox1.Location = new System.Drawing.Point(12, 478);
			this.textBox1.Name = "textBox1";
			this.textBox1.Size = new System.Drawing.Size(75, 20);
			this.textBox1.TabIndex = 2;
			// 
			// goToOtsu
			// 
			this.goToOtsu.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
			this.goToOtsu.Location = new System.Drawing.Point(94, 504);
			this.goToOtsu.Name = "goToOtsu";
			this.goToOtsu.Size = new System.Drawing.Size(75, 44);
			this.goToOtsu.TabIndex = 3;
			this.goToOtsu.Text = "Otsu";
			this.goToOtsu.UseVisualStyleBackColor = true;
			this.goToOtsu.Click += new System.EventHandler(this.goToOtsu_Click);
			// 
			// otsu2
			// 
			this.otsu2.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
			this.otsu2.Location = new System.Drawing.Point(175, 504);
			this.otsu2.Name = "otsu2";
			this.otsu2.Size = new System.Drawing.Size(75, 44);
			this.otsu2.TabIndex = 4;
			this.otsu2.Text = "Otsu 2";
			this.otsu2.UseVisualStyleBackColor = true;
			this.otsu2.Click += new System.EventHandler(this.otsu2_Click);
			// 
			// goToOtsu3
			// 
			this.goToOtsu3.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
			this.goToOtsu3.Location = new System.Drawing.Point(256, 504);
			this.goToOtsu3.Name = "goToOtsu3";
			this.goToOtsu3.Size = new System.Drawing.Size(75, 44);
			this.goToOtsu3.TabIndex = 5;
			this.goToOtsu3.Text = "Otsu 3";
			this.goToOtsu3.UseVisualStyleBackColor = true;
			this.goToOtsu3.Click += new System.EventHandler(this.goToOtsu3_Click);
			// 
			// Form1
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(691, 560);
			this.Controls.Add(this.goToOtsu3);
			this.Controls.Add(this.otsu2);
			this.Controls.Add(this.goToOtsu);
			this.Controls.Add(this.textBox1);
			this.Controls.Add(this.GoToGray);
			this.Controls.Add(this.pictureBox1);
			this.Name = "Form1";
			this.Text = "Form1";
			((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
			this.ResumeLayout(false);
			this.PerformLayout();

		}

		#endregion

		private System.Windows.Forms.PictureBox pictureBox1;
		private System.Windows.Forms.Button GoToGray;
		private System.Windows.Forms.TextBox textBox1;
        private System.Windows.Forms.Button goToOtsu;
        private System.Windows.Forms.Button otsu2;
        private System.Windows.Forms.Button goToOtsu3;
    }
}

